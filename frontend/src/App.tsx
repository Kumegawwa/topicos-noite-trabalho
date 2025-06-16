import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Importa componentes do React Router para navegação.
// BrowserRouter: O roteador principal que usa a API de histórico do HTML5 para manter a UI sincronizada com a URL.
// Routes: Um container para um conjunto de rotas. Ele renderiza a primeira <Route> que corresponde à URL atual.
// Route: Componente que define um caminho e o elemento a ser renderizado quando o caminho corresponde.

// Importa os componentes de layout e navegação.
import Header from './components/Header';
import Footer from './components/Footer';
import Navbar from './components/Navbar';

// Importa as páginas (views) da aplicação para Alunos, Cursos e Matérias.
// A estrutura de pastas reflete a organização por funcionalidade (alunos/, cursos/, materias/).
import HomePage from './pages/HomePage';
import ListarAlunos from './pages/alunos/ListarAluno';
import CadastrarAluno from './pages/alunos/CadastrarAluno';
import EditarAluno from './pages/alunos/EditarAluno';
import ListarCursos from './pages/cursos/ListarCursos';
import CadastrarCurso from './pages/cursos/CadastrarCurso';
import EditarCurso from './pages/cursos/EditarCurso';
import ListarMaterias from './pages/materias/ListarMaterias';
import CadastrarMateria from './pages/materias/CadastrarMateria';
import EditarMateria from './pages/materias/EditarMateria';

import './styles/global.css'; // Importa o arquivo CSS global para estilos da aplicação.

function App() {
  return (
    <Router> {/* O Router envolve toda a aplicação para habilitar a funcionalidade de roteamento. */}
      <div className="app-container"> {/* Container principal da aplicação para estilização global (flexbox para layout). */}
        <Header /> {/* Componente de cabeçalho, presente em todas as páginas. */}
        <Navbar /> {/* Componente de navegação, presente em todas as páginas. */}
        <main> {/* A tag <main> semântica para o conteúdo principal, que varia com as rotas. */}
          <Routes> {/* As rotas são definidas aqui. Apenas uma rota será renderizada por vez. */}
            <Route path="/" element={<HomePage />} /> {/* Rota para a página inicial. */}

            {/* Rotas para a funcionalidade de Alunos (CRUD) */}
            <Route path="/alunos" element={<ListarAlunos />} /> {/* Exibe a lista de alunos. */}
            <Route path="/alunos/cadastrar" element={<CadastrarAluno />} /> {/* Formulário para cadastrar novo aluno. */}
            <Route path="/alunos/editar/:id" element={<EditarAluno />} /> {/* Formulário para editar aluno existente, com ':id' como parâmetro de URL. */}

            {/* Rotas para a funcionalidade de Cursos (CRUD) */}
            <Route path="/cursos" element={<ListarCursos />} /> {/* Exibe a lista de cursos. */}
            <Route path="/cursos/cadastrar" element={<CadastrarCurso />} /> {/* Formulário para cadastrar novo curso. */}
            <Route path="/cursos/editar/:id" element={<EditarCurso />} /> {/* Formulário para editar curso existente. */}

            {/* Rotas para a funcionalidade de Matérias (CRUD) */}
            <Route path="/materias" element={<ListarMaterias />} /> {/* Exibe a lista de matérias. */}
            <Route path="/materias/cadastrar" element={<CadastrarMateria />} /> {/* Formulário para cadastrar nova matéria. */}
            <Route path="/materias/editar/:id" element={<EditarMateria />} /> {/* Formulário para editar matéria existente. */}
          </Routes>
        </main>
        <Footer /> {/* Componente de rodapé, presente em todas as páginas. */}
      </div>
    </Router>
  );
}

export default App; // Exporta o componente App para ser renderizado no `index.tsx`.