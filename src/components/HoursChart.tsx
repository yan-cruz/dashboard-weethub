
import React from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Label,
  LabelList
} from "recharts";

interface ChartData {
  name: string;
  horas: number;
}

interface HoursChartProps {
  dados: {
    data: string;
    horasTrabalhadas: number;
  }[];
}

const HoursChart: React.FC<HoursChartProps> = ({ dados }) => {
  // Transformar dados para o formato do gráfico
  const chartData: ChartData[] = dados.map(item => ({
    name: item.data, // Usar diretamente o formato abreviado (já vem formatado da API)
    horas: item.horasTrabalhadas
  }));

  // Format the hours for display in label with two decimal places
  const formatHours = (value: number) => {
    if (value === 0) return "0.00";
    return value.toFixed(2).toString();
  };

  return (
    <div className="bg-dark-200 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-6 text-white">
        Horas Utilizadas por Mês
      </h2>
      
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 30, // Increased top margin for labels
              right: 40, // Increased right margin for better spacing
              left: 30, // Increased left margin for better spacing
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis 
              dataKey="name" 
              stroke="#999"
              tick={{ fill: "#999" }}
              allowDecimals={false}
              padding={{ left: 30, right: 30 }} // Adding padding to avoid data points at edges
            />
            <YAxis 
              stroke="#999"
              tick={{ fill: "#999" }}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: "#1a1a1a", 
                border: "1px solid #333",
                color: "#fff"
              }}
              labelStyle={{ color: "#FFD700" }}
              formatter={(value) => [`${value} horas`, "Horas Utilizadas"]}
            />
            <Line
              type="monotone"
              dataKey="horas"
              stroke="#FFD700"
              strokeWidth={2}
              activeDot={{ r: 8 }}
              dot={{ stroke: "#FFD700", strokeWidth: 2, fill: "#121212", r: 4 }}
              name="Horas Utilizadas"
              isAnimationActive={true}
            >
              <LabelList 
                dataKey="horas" 
                position="top" 
                fill="#FFD700"
                formatter={formatHours}
                offset={10}
              />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HoursChart;
