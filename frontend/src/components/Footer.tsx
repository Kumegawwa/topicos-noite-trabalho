import React from 'react';
import './Footer.css'; // Importa o arquivo CSS para estilos específicos do rodapé.

// Declaração de um componente funcional React chamado Footer.
// React.FC (Function Component) é um tipo genérico que indica que é um componente funcional.
const Footer: React.FC = () => {
  return (
    // Renderiza um elemento <footer> com a classe CSS 'app-footer' para estilização.
    <footer className="app-footer">
      {/* Exibe o ano atual dinamicamente usando JavaScript e um texto de direitos autorais. */}
      <p>&copy; {new Date().getFullYear()} Gerenciador Escolar. Todos os direitos reservados.</p>
    </footer>
  );
};

export default Footer; // Exporta o componente Footer para que ele possa ser usado em outras partes da aplicação.