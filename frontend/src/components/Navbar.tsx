import React from 'react';
import { Link, NavLink } from 'react-router-dom'; // Importa Link para navegação e NavLink para estilização de links ativos.
import './Navbar.css'; // Importa o arquivo CSS para estilos específicos da barra de navegação.

// Declaração de um componente funcional React chamado Navbar.
const Navbar: React.FC = () => {
  return (
    // Renderiza um elemento <nav> com a classe CSS 'app-navbar' para estilização.
    <nav className="app-navbar">
      <ul> {/* Lista não ordenada para os itens de navegação. */}
        {/* NavLink é usado em vez de Link para aplicar estilos automaticamente
            quando a rota correspondente está ativa. O atributo 'end' garante
            que o estilo 'active' seja aplicado apenas quando o caminho é exatamente '/'. */}
        <li><NavLink to="/" end>Início</NavLink></li>
        {/* Links para as páginas de Alunos, Cursos e Matérias. */}
        <li><NavLink to="/alunos">Alunos</NavLink></li>
        <li><NavLink to="/cursos">Cursos</NavLink></li>
        <li><NavLink to="/materias">Matérias</NavLink></li>
      </ul>
    </nav>
  );
};

export default Navbar; // Exporta o componente Navbar para ser utilizado no componente principal App.