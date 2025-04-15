
import React from "react";

const Header: React.FC = () => {
  return (
    <header className="flex flex-col md:flex-row items-center mb-8">
      <div className="flex items-center gap-32 mb-4 md:mb-0">
        <img 
          src="https://i.imgur.com/p9Fb9W8.png" 
          alt="Logo" 
          className="h-20 md:h-28 object-contain" 
        />
        <h1 className="text-5xl text-highlight font-bold">
          Acompanhamento de Horas
        </h1>
      </div>
    </header>
  );
};

export default Header;
