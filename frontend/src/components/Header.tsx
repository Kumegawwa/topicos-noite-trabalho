import React from 'react';
import './Header.css'; // Importa o arquivo CSS para estilos específicos do cabeçalho.

// Declaração de um componente funcional React chamado Header.
// React.FC (Function Component) é um tipo genérico que indica que é um componente funcional.
const Header: React.FC = () => {
  return (
    // Renderiza um elemento <header> com a classe CSS 'app-header' para estilização.
    <header className="app-header">
      {/* Exibe o título principal da aplicação. */}
      <h1>Gerenciador Escolar</h1>
    </header>
  );
};

export default Header; // Exporta o componente Header para que ele possa ser usado em outras partes da aplicação.