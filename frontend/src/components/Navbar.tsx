import React from 'react';
import { Link, NavLink } from 'react-router-dom'; // Usar NavLink para estilo ativo
import './Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="app-navbar">
      <ul>
        <li><NavLink to="/" end>Início</NavLink></li>
        <li><NavLink to="/alunos">Alunos</NavLink></li>
        <li><NavLink to="/cursos">Cursos</NavLink></li>
        <li><NavLink to="/materias">Matérias</NavLink></li>
      </ul>
    </nav>
  );
};

export default Navbar;