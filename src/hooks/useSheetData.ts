
import { useState, useEffect } from "react";
import { fetchSheetData, getMesAtual } from "@/utils/googleSheetsService";
import { toast } from "sonner";

interface HorasData {
  cliente: string;
  horasTotais: number;
  horasTrabalhadas: number;
  data: string;
}

interface DadosMensais {
  mes: string;
  total: number;
}

interface DashboardData {
  horasTotais: number;
  horasTrabalhadas: number;
  clientesData: { 
    cliente: string; 
    horasTotais: number; 
    horasTrabalhadas: number; 
  }[];
  horasPorMes: { 
    data: string; 
    horasTrabalhadas: number;
  }[];
  isLoading: boolean;
}

export const useSheetData = (): DashboardData => {
  const [clientesData, setClientesData] = useState<HorasData[]>([]);
  const [dadosMensais, setDadosMensais] = useState<DadosMensais[]>([]);
  const [totalMesAtual, setTotalMesAtual] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const dados = await fetchSheetData();
        setClientesData(dados.clientesData);
        setDadosMensais(dados.dadosMensais);
        setTotalMesAtual(dados.totalMesAtual);
        toast.success("Dados carregados com sucesso", { duration: 3000 });
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Falha ao carregar dados");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Atualizar a cada 5 minutos
    const intervalo = setInterval(loadData, 5 * 60 * 1000);
    return () => clearInterval(intervalo);
  }, []);

  // Processamento dos dados para resumo
  const horasTotais = clientesData.reduce((sum, item) => sum + item.horasTotais, 0);
  const horasTrabalhadas = totalMesAtual; // Usar o total do mês atual como horas trabalhadas

  // Processamento dos dados para o gráfico de linha
  const horasPorMes = dadosMensais.map(item => ({
    data: item.mes, // Usar o formato abreviado que já vem da planilha
    horasTrabalhadas: item.total
  }));

  // Processamento dos dados para tabela de clientes (ordenados por nome)
  const clientesOrdenados = [...clientesData].sort((a, b) => a.cliente.localeCompare(b.cliente));

  return {
    horasTotais,
    horasTrabalhadas,
    clientesData: clientesOrdenados,
    horasPorMes,
    isLoading,
  };
};
