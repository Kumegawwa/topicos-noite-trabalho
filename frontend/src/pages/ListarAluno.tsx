// src/pages/ListarAluno.tsx
import React, { useState, useEffect } from 'react';
import api from '../services/api'; // Importa a instância configurada do Axios
import { Aluno } from '../types'; // Importa a interface Aluno

const ListarAluno: React.FC = () => {
  // Estado para armazenar a lista de alunos
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  // Estado para indicar se os dados estão sendo carregados
  const [loading, setLoading] = useState<boolean>(true);
  // Estado para armazenar mensagens de erro
  const [error, setError] = useState<string | null>(null);

  // useEffect para buscar os dados quando o componente for montado
  useEffect(() => {
    // Define uma função assíncrona para buscar os dados
    const fetchAlunos = async () => {
      try {
        setLoading(true); // Inicia o carregamento
        setError(null); // Limpa erros anteriores
        console.log('Buscando alunos em /alunos...'); // Log para depuração
        const response = await api.get<Aluno[]>('/alunos'); // Faz a requisição GET para /alunos
        console.log('Dados recebidos:', response.data); // Log para depuração
        setAlunos(response.data); // Atualiza o estado com os dados recebidos
      } catch (err) {
        console.error('Erro ao buscar alunos:', err); // Log detalhado do erro
        setError('Falha ao carregar a lista de alunos.'); // Define a mensagem de erro
        setAlunos([]); // Limpa os alunos em caso de erro
      } finally {
        setLoading(false); // Finaliza o carregamento, mesmo que dê erro
      }
    };

    fetchAlunos(); // Chama a função de busca

    // A função de limpeza (retorno do useEffect) é opcional aqui,
    // pois a requisição Axios geralmente lida bem com unmounts.
    // Para requisições mais complexas ou subscriptions, você usaria
    // um AbortController aqui para cancelar a requisição ao desmontar.

  }, []); // O array vazio [] como segundo argumento garante que o useEffect execute apenas uma vez, quando o componente montar

  // Renderização condicional baseada nos estados
  if (loading) {
    return <p>Carregando alunos...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Erro: {error}</p>;
  }

  return (
    <div>
      <h1>Lista de Alunos</h1>
      {alunos.length === 0 ? (
        <p>Nenhum aluno encontrado.</p>
      ) : (
        <ul>
          {alunos.map((aluno) => (
            <li key={aluno.id}> {/* Usa o ID como chave única */}
              <strong>{aluno.nome}</strong>
              {aluno.email && ` - ${aluno.email}`} {/* Exibe email se existir */}
              {aluno.matricula && ` (Matrícula: ${aluno.matricula})`} {/* Exibe matrícula se existir */}
            </li>
          ))}
        </ul>
      )}
      {/* Você pode adicionar botões para adicionar, editar, excluir aqui */}
    </div>
  );
};

export default ListarAluno;