// src/pages/ListarAluno.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Importar Link para navegação
import api from '../services/api';
import { Aluno } from '../types'; // Importar a interface Aluno

const ListarAluno: React.FC = () => {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar os alunos da API
  const fetchAlunos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get<Aluno[]>('/alunos'); // Espera um array de Alunos
      setAlunos(response.data);
    } catch (err: any) { // Captura erros
      console.error('Erro ao buscar alunos:', err);
      setError(`Falha ao buscar alunos: ${err.message || 'Erro desconhecido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect para buscar os alunos quando o componente montar
  useEffect(() => {
    fetchAlunos();
  }, []); // Array vazio significa que executa apenas uma vez na montagem

  // Função para lidar com a exclusão de um aluno
  const handleDelete = async (id: number) => {
    // Confirmação antes de excluir
    if (!window.confirm(`Tem certeza que deseja excluir o aluno com ID ${id}?`)) {
      return;
    }

    try {
      await api.delete(`/alunos/${id}`);
      // Atualiza a lista de alunos removendo o que foi excluído
      setAlunos(alunos.filter(aluno => aluno.id !== id));
      alert('Aluno excluído com sucesso!'); // Feedback simples
    } catch (err: any) {
      console.error('Erro ao excluir aluno:', err);
      setError(`Falha ao excluir aluno: ${err.message || 'Erro desconhecido'}`);
      alert(`Erro ao excluir aluno: ${err.message || 'Erro desconhecido'}`); // Feedback de erro
    }
  };

  // Renderização condicional enquanto carrega
  if (isLoading) {
    return <p>Carregando alunos...</p>;
  }

  // Renderização em caso de erro
  if (error) {
    return <p style={{ color: 'red' }}>Erro: {error}</p>;
  }

  // Renderização da lista de alunos
  return (
    <div>
      <h2>Lista de Alunos</h2>
      {alunos.length === 0 ? (
        <p>Nenhum aluno cadastrado.</p>
      ) : (
        <table border={1} style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Matrícula</th>
              <th>Data de Nascimento</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {alunos.map((aluno) => (
              <tr key={aluno.id}>
                <td>{aluno.id}</td>
                <td>{aluno.nome}</td>
                <td>{aluno.email}</td>
                <td>{aluno.matricula}</td>
                <td>{new Date(aluno.dataNascimento).toLocaleDateString()}</td> {/* Formata a data */}
                <td>
                  {/* Link para a página de edição */}
                  <Link to={`/editar-aluno/${aluno.id}`}>
                    <button style={{ marginRight: '5px' }}>Editar</button>
                  </Link>
                  {/* Botão para excluir */}
                  <button onClick={() => handleDelete(aluno.id)} style={{ backgroundColor: 'red', color: 'white' }}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* Link para voltar ou ir para cadastro */}
      <br />
      <Link to="/cadastrar-aluno">
        <button>Cadastrar Novo Aluno</button>
      </Link>
    </div>
  );
};

export default ListarAluno;