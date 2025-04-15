
import React from "react";
import Header from "@/components/Header";
import SummaryCard from "@/components/SummaryCard";
import ClientTable from "@/components/ClientTable";
import HoursChart from "@/components/HoursChart";
import { useSheetData } from "@/hooks/useSheetData";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const Index: React.FC = () => {
  const { 
    horasTotais, 
    horasTrabalhadas, 
    clientesData, 
    horasPorMes, 
    isLoading 
  } = useSheetData();

  React.useEffect(() => {
    toast.info(
      "Conectando à planilha do Google Sheets...",
      {
        description: "Os dados são atualizados automaticamente."
      }
    );
  }, []);

  return (
    <div className="min-h-screen w-full bg-dark-500 text-white p-4 md:p-6 overflow-hidden">
      <div className="w-full px-4 md:px-8 mx-auto flex flex-col">
        {/* Centralize o header horizontalmente */}
        <div className="flex justify-center mb-1">
          <Header />
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1">
            <div>
              <Skeleton className="h-full w-full bg-dark-200" />
            </div>
            <div className="lg:col-span-2">
              <Skeleton className="h-full w-full bg-dark-200" />
            </div>
            <div className="lg:col-span-3">
              <Skeleton className="h-64 w-full bg-dark-200" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1">
            {/* Centralização vertical aprimorada do SummaryCard */}
            <div className="flex items-center justify-center h-full">
              <div className="bg-dark-200 p-6 rounded-lg h-full w-full flex flex-col justify-center items-center">
                <SummaryCard 
                  horasTotais={horasTotais} 
                  horasTrabalhadas={horasTrabalhadas}
                />
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <ClientTable dados={clientesData} />
            </div>
            
            <div className="lg:col-span-3">
              <HoursChart dados={horasPorMes} />
            </div>
          </div>
        )}
        
        <div className="mt-4 text-center text-gray-400 text-xs">
          <p>
            Dados atualizados automaticamente. Os dados são carregados da planilha do Google Sheets.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
