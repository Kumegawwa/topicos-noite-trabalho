import React from 'react';
import './Footer.css'; // Crie este arquivo para estilos específicos do Footer

const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <p>&copy; {new Date().getFullYear()} Gerenciador Escolar. Todos os direitos reservados.</p>
    </footer>
  );
};

export default Footer;