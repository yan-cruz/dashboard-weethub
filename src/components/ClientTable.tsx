import React, { useEffect, useRef } from "react";

interface ClientData {
  cliente: string;
  horasTotais: number;
  horasTrabalhadas: number;
}

interface ClientTableProps {
  dados: ClientData[];
}

const ClientTable: React.FC<ClientTableProps> = ({ dados }) => {
  const dadosOrdenados = [...dados].sort((a, b) => a.cliente.localeCompare(b.cliente));
  console.log(dados);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isPaused = false;

    const interval = setInterval(() => {
      if (scrollRef.current && !isPaused) {
        const container = scrollRef.current;

        const isAtBottom =
          container.scrollTop + container.clientHeight >= container.scrollHeight - 1;

        if (isAtBottom) {
          isPaused = true;

          setTimeout(() => {
            container.scrollTo({ top: 0, behavior: 'auto' });

            setTimeout(() => {
              isPaused = false;
            }, 450); // Pausa rápida depois de voltar ao topo

          }, 1000); // Pausa ao chegar no final da lista
        } else {
          container.scrollBy({ top: 1, behavior: 'smooth' });
        }
      }
    }, 75); // Rola 1px a cada 75ms

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-dark-200 p-6 rounded-lg shadow-lg flex flex-col h-full">
      <h2 className="text-xl font-bold mb-4 text-white">
        Horas Utilizadas por Clientes
      </h2>

      <div className="overflow-hidden max-h-[300px] h-full">
        <div
          ref={scrollRef}
          className="overflow-y-auto scroll-smooth custom-scroll pr-2 max-h-[300px] h-full"
        >
          <table className="w-full text-left border-collapse table-auto">
            <thead className="sticky top-0 bg-dark-200 z-50 pr-2 border-b border-gray-700">
              <tr className="leading-none">
                <th className="py-2 text-highlight w-8">#</th>
                <th className="py-2 text-highlight">Cliente</th>
                <th className="py-2 text-highlight w-32">Usadas</th>
                <th className="py-2 text-highlight w-32">Totais</th>
                <th className="py-2 text-highlight">Progresso</th>
              </tr>
            </thead>

            <tbody className="pb-2">
              {dadosOrdenados.map((cliente, index) => {
                const percentual =
                  cliente.horasTotais > 0
                    ? (cliente.horasTrabalhadas / cliente.horasTotais) * 100
                    : 0;

                // Definir a cor da barra de progresso com base no percentual
                // Se percentual > 100%, cor será vermelha. Caso contrário, amarela.
                const progressBarColor =
                  percentual > 100 ? "#A61920" : "#FFCC00"; // Vermelho para > 100%, Amarelo para <= 100%

                // Definir a cor do texto (rótulo) de porcentagem com base no percentual
                const labelColor = percentual > 100 ? "text-red-500" : "text-highlight"; // Vermelho para > 100%, Amarelo para <= 100%

                return (
                  <tr key={cliente.cliente} className="border-b border-gray-800">
                    <td className="py-3 text-gray-300">{index + 1}.</td>
                    <td className="py-3 text-white">{cliente.cliente}</td>
                    <td className="py-3 text-white">
                      {cliente.horasTrabalhadas > 0
                        ? cliente.horasTrabalhadas.toFixed(2)
                        : "-"}
                    </td>
                    <td className="py-3 text-white">{cliente.horasTotais}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm w-12 ${labelColor}`} // Aplica a cor dinamicamente ao rótulo de porcentagem
                        >
                          {percentual.toFixed(0)}%
                        </span>
                        <div className="progress-bar flex-1">
                          <div
                            className="progress-bar-fill mr-2"
                            style={{
                              width: `${percentual}%`,
                              backgroundColor: progressBarColor, // Aplica a cor dinamicamente
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientTable;