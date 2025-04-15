
import { toast } from "sonner";

interface HorasData {
  cliente: string;
  horasTotais: number;
  horasTrabalhadas: number;
  data: string;
}

// Função para formatar a data do formato MM/YYYY para "mmm/yyyy"
export const formatarData = (data: string): string => {
  if (!data) return "";
  
  const [mes, ano] = data.split('/');
  const date = new Date(parseInt(ano), parseInt(mes) - 1);
  
  // Formatação para português abreviado
  const meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  
  return `${meses[date.getMonth()]}/${date.getFullYear()}`;
};

// Função para converter formato de tempo (HH:MM:SS.mmm) para decimal
export const convertTimeToDecimal = (timeString: string | number): number => {
  if (typeof timeString === 'number') {
    return timeString;
  }
  
  if (!timeString || timeString === "") {
    return 0;
  }
  
  try {
    // Verifica se o valor é no formato de tempo (HH:MM:SS.mmm)
    if (timeString.includes(":")) {
      const parts = timeString.split(":");
      const hours = parseInt(parts[0], 10);
      const minutes = parts.length > 1 ? parseInt(parts[1], 10) : 0;
      
      // Lidar com segundos e milissegundos, se existirem
      let seconds = 0;
      if (parts.length > 2) {
        const secondsPart = parts[2].split(".");
        seconds = parseInt(secondsPart[0], 10);
        // Ignoramos os milissegundos para a exibição
      }
      
      // Formato de exibição sem milissegundos
      return parseFloat((hours + minutes / 60 + seconds / 3600).toFixed(2));
    } 
    
    // Se não for no formato de tempo, tenta converter diretamente
    return parseFloat(timeString);
  } catch (error) {
    console.error("Erro ao converter tempo:", error);
    return 0;
  }
};

// Função para obter o mês atual no formato MM/YYYY
export const getMesAtual = (): string => {
  const date = new Date();
  const mes = date.getMonth() + 1; // getMonth() retorna 0-11
  const ano = date.getFullYear();
  
  return `${mes.toString().padStart(2, '0')}/${ano}`;
};

// Função para obter a abreviação do mês atual (ex: "abr" para abril)
function getMesAtualAbreviado(): string {
  const date = new Date();
  const meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  return meses[date.getMonth()];
}

// Função para buscar dados da planilha usando a Google Visualization API
// Função para buscar dados da planilha usando a Google Visualization API
export const fetchSheetData = async (): Promise<{
  clientesData: HorasData[];
  dadosMensais: { mes: string; total: number }[];
  totalMesAtual: number;
}> => {
  try {
    const SHEET_ID = "1WBqEJ7xyV93onTr2mqSYpNPU-2uZ5-88k_GXPa3CE_0";
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Falha ao buscar dados da planilha");
    }

    const text = await response.text();
    // Remover prefixo e sufixo para obter JSON válido
    const jsonData = JSON.parse(text.substring(47).slice(0, -2));

    // Pegando os dados da tabela
    const rows = jsonData.table.rows;

    // Dados dos clientes (colunas A, B, C, D, etc.)
    const clientesData: HorasData[] = [];
    const mesAtual = getMesAtual(); // Ex: "05/2025" (maio de 2025)
    const mesAtualIndex = parseInt(mesAtual.split("/")[0]) - 1; // Pega o mês (0-11), por exemplo, maio -> 4

    // Ajustando o índice para considerar o mês atual
    const colIndex = mesAtualIndex - 1; // A partir de abril (C) = coluna 2 (índice 2)

    // Extrair os dados de clientes
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i].c;
      // Verificar se temos um cliente válido (coluna A)
      if (row && row[0] && row[0].v) {
        // Pega as horas trabalhadas da coluna correta (C para abril, D para maio, etc.)
        const horasTrabalhadas =
          row[colIndex]?.v // Mes atual começa na coluna C (índice 2)
            ? convertTimeToDecimal(row[colIndex]?.v)
            : 0;

        clientesData.push({
          cliente: row[0].v || "",
          horasTotais: parseFloat(row[1]?.v) || 0,
          horasTrabalhadas,
          data: mesAtual, // Associar a data correta para cada cliente
        });
      }
    }

    // Extrair dados mensais (coluna N para mês e O para total)
    const dadosMensais: { mes: string; total: number }[] = [];
    let totalMesAtual = 0;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i].c;
      // Verificar se temos informação de mês (coluna N) e total (coluna O)
      if (row && row[13] && row[13].v && row[14] && row[14].v) {
        const mesInfo = row[13].f; // Formato abreviado (ex: "abr./25")
        const total = convertTimeToDecimal(row[14].v);

        dadosMensais.push({
          mes: mesInfo,
          total: total,
        });

        // Verificar se este é o mês atual para obter o total do mês atual
        const mesData = row[13].f;
        if (mesData && mesData.includes(getMesAtualAbreviado())) {
          totalMesAtual = total;
        }
      }
    }

    return {
      clientesData,
      dadosMensais,
      totalMesAtual,
    };
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    toast.error("Erro ao carregar dados da planilha");

    // Retornamos alguns dados de exemplo para desenvolvimento
    return {
      clientesData: [
        { cliente: "VKS3", horasTotais: 30, horasTrabalhadas: 5, data: "05/2025" },
        { cliente: "SDK5", horasTotais: 60, horasTrabalhadas: 10, data: "05/2025" },
        { cliente: "ISS5", horasTotais: 30, horasTrabalhadas: 20, data: "05/2025" },
        { cliente: "CEE5", horasTotais: 60, horasTrabalhadas: 16.01, data: "05/2025" },
        { cliente: "ASR6", horasTotais: 30, horasTrabalhadas: 3, data: "05/2025" },
      ],
      dadosMensais: [
        { mes: "mai/25", total: 122.01 },
        { mes: "jun/25", total: 0 },
        { mes: "jul/25", total: 0 },
        { mes: "ago/25", total: 0 },
        { mes: "set/25", total: 0 },
      ],
      totalMesAtual: 122.01,
    };
  }
};


// Função para gerar meses de um período
export const gerarMesesPeriodo = (dataInicial: string, mesesAFente: number = 8): string[] => {
  const [mesInicial, anoInicial] = dataInicial.split('/').map(Number);
  const resultado: string[] = [];
  
  for (let i = 0; i < mesesAFente; i++) {
    let novoMes = mesInicial + i;
    let novoAno = anoInicial;
    
    if (novoMes > 12) {
      novoMes = novoMes - 12;
      novoAno += 1;
    }
    
    const dataFormatada = `${novoMes.toString().padStart(2, '0')}/${novoAno}`;
    resultado.push(dataFormatada);
  }
  
  return resultado;
};
