
import React from "react";

interface SummaryCardProps {
  horasTotais: number;
  horasTrabalhadas: number;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ horasTotais, horasTrabalhadas }) => {
  // Calcular a porcentagem trabalhada
  const percentualTrabalhado = horasTotais > 0 
    ? ((horasTrabalhadas / horasTotais) * 100).toFixed(2) 
    : "0.00";

  // Format hours display
  const formatHoras = (horas: number): string => {
    if (Number.isInteger(horas)) {
      return horas.toString();
    }
    return horas.toFixed(2);
  };

  return (
    <div className="bg-dark-200 p-6 rounded-lg">
      <div className="space-y-6">
        <div>
          <h3 className="text-gray-400 text-xl mb-1">Horas Totais</h3>
          <p className="text-highlight text-5xl font-bold">{formatHoras(horasTotais)}</p>
        </div>
        
        <div>
          <h3 className="text-gray-400 text-xl mb-1">Horas Trabalhadas</h3>
          <p className="text-highlight text-5xl font-bold">
            {formatHoras(horasTrabalhadas)}
          </p>
        </div>
        
        <div>
          <h3 className="text-gray-400 text-xl mb-1">% Trabalhada</h3>
          <p className="text-highlight text-5xl font-bold">{percentualTrabalhado}%</p>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
