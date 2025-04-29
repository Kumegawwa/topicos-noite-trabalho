// src/pages/EditarAluno.tsx
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Hooks para pegar parâmetros da URL e navegar
import api from '../services/api';
import { Aluno } from '../types';

const EditarAluno: React.FC = () => {
  // Pega o 'id' do aluno da URL (ex: /editar-aluno/123)
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate(); // Hook para redirecionar o usuário

  // Estado para armazenar os dados do aluno a ser editado
  // Usamos Partial<Aluno> para permitir que o estado inicial seja vazio ou incompleto
  const [aluno, setAluno] = useState<Partial<Aluno>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // useEffect para buscar os dados do aluno específico quando o componente montar ou o ID mudar
  useEffect(() => {
    const fetchAluno = async () => {
      if (!id) {
        setError('ID do aluno não fornecido na URL.');
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get<Aluno>(`/alunos/${id}`);
        // Formata a data para o formato YYYY-MM-DD esperado pelo input type="date"
        const formattedData = {
          ...response.data,
          dataNascimento: response.data.dataNascimento.split('T')[0] // Pega apenas a parte da data
        };
        setAluno(formattedData);
      } catch (err: any) {
        console.error('Erro ao buscar aluno:', err);
        setError(`Falha ao buscar dados do aluno: ${err.response?.data?.message || err.message || 'Erro desconhecido'}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAluno();
  }, [id]); // Dependência: re-executa se o 'id' mudar

  // Função para lidar com mudanças nos inputs do formulário
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setAluno(prevAluno => ({
      ...prevAluno,
      [name]: value,
    }));
    // Limpa mensagens ao começar a editar
    setError(null);
    setSuccessMessage(null);
  };

  // Função para lidar com a submissão do formulário (salvar alterações)
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validação básica no frontend (a validação principal ocorre no backend)
    if (!aluno.nome || !aluno.email || !aluno.matricula || !aluno.dataNascimento) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      setSuccessMessage(null);
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      console.log('Enviando atualização:', aluno); // Log para depuração
      // Faz a requisição PUT para a API
      await api.put(`/alunos/${id}`, aluno);

      setSuccessMessage('Aluno atualizado com sucesso!');
      // Opcional: redirecionar para a lista após um tempo ou deixar o usuário clicar
      setTimeout(() => navigate('/alunos'), 1500); // Redireciona para a lista após 1.5s

    } catch (err: any) {
      console.error('Erro ao atualizar aluno:', err);
      const apiErrorMessage = err.response?.data?.errors ? 
                                JSON.stringify(err.response.data.errors) : 
                                (err.response?.data?.message || err.response?.data?.title || err.message);
      setError(`Falha ao atualizar aluno: ${apiErrorMessage || 'Erro desconhecido'}`);
      setSuccessMessage(null);
    } finally {
      setIsSaving(false);
    }
  };

  // Renderização enquanto busca os dados
  if (isLoading) {
    return <p>Carregando dados do aluno...</p>;
  }

  // Renderização se não encontrar o aluno ou houver erro na busca inicial
  if (error && !aluno.id) { // Se houve erro e não temos dados do aluno
    return <p style={{ color: 'red' }}>Erro: {error}</p>;
  }

  // Renderização do formulário de edição
  return (
    <div>
      <h2>Editar Aluno (ID: {id})</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nome">Nome:</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={aluno.nome || ''} // Usa '' como fallback se for undefined
            onChange={handleInputChange}
            required
            disabled={isSaving}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={aluno.email || ''}
            onChange={handleInputChange}
            required
            disabled={isSaving}
          />
        </div>
        <div>
          <label htmlFor="matricula">Matrícula:</label>
          <input
            type="text"
            id="matricula"
            name="matricula"
            value={aluno.matricula || ''}
            onChange={handleInputChange}
            required
            disabled={isSaving}
          />
        </div>
        <div>
          <label htmlFor="dataNascimento">Data de Nascimento:</label>
          <input
            type="date" // Input de data
            id="dataNascimento"
            name="dataNascimento"
            value={aluno.dataNascimento || ''}
            onChange={handleInputChange}
            required
            disabled={isSaving}
          />
        </div>

        {/* Feedback para o usuário */} 
        {isSaving && <p>Salvando alterações...</p>}
        {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

        <button type="submit" disabled={isSaving}>
          {isSaving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
        <button type="button" onClick={() => navigate('/alunos')} disabled={isSaving} style={{ marginLeft: '10px' }}>
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default EditarAluno;
