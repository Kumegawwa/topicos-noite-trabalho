import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Caminhos corrigidos para os componentes
import Header from './components/Header'; 
import Footer from './components/Footer';
import Navbar from './components/Navbar';
// Caminhos corrigidos para as páginas
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
import './styles/global.css'; // Estilos globais

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* Rotas Alunos */}
            <Route path="/alunos" element={<ListarAlunos />} />
            <Route path="/alunos/cadastrar" element={<CadastrarAluno />} />
            <Route path="/alunos/editar/:id" element={<EditarAluno />} />
            {/* Rotas Cursos */}
            <Route path="/cursos" element={<ListarCursos />} />
            <Route path="/cursos/cadastrar" element={<CadastrarCurso />} />
            <Route path="/cursos/editar/:id" element={<EditarCurso />} />
            {/* Rotas Matérias */}
            <Route path="/materias" element={<ListarMaterias />} />
            <Route path="/materias/cadastrar" element={<CadastrarMateria />} />
            <Route path="/materias/editar/:id" element={<EditarMateria />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;