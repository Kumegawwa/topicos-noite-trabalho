// src/pages/CadastrarAluno.tsx
import React, { useState, ChangeEvent, FormEvent } from 'react';
import api from '../services/api'; // Importa a instância configurada do Axios
// Se precisar do tipo Aluno para o objeto de retorno ou quiser usar Partial<Aluno>
// import { Aluno } from '../types';

const CadastrarAluno: React.FC = () => {
  // Estados para cada campo do formulário
  const [nome, setNome] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [matricula, setMatricula] = useState<string>('');

  // Estado para feedback ao usuário
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Função para lidar com a submissão do formulário
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Impede o recarregamento padrão da página

    // Validação básica (opcional, a validação principal deve ser no backend)
    if (!nome || !email || !matricula) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      setSuccessMessage(null);
      return;
    }

    setIsLoading(true); // Indica que o envio começou
    setError(null); // Limpa erros anteriores
    setSuccessMessage(null); // Limpa mensagens de sucesso anteriores

    // Cria o objeto de dados para enviar à API
    const alunoData = {
      nome, // nome: nome
      email, // email: email
      matricula, // matricula: matricula
      // Adicione outras propriedades se necessário, conforme definido no seu modelo C#
      // dataNascimento: '...', // etc.
    };

    try {
      console.log('Enviando dados:', alunoData); // Log para depuração
      // Faz a requisição POST para a API
      // O segundo argumento do api.post é o corpo da requisição (os dados)
      const response = await api.post('/alunos', alunoData);

      console.log('Resposta da API:', response); // Log para depuração

      // Verifica se a API retornou status de sucesso (ex: 201 Created)
      if (response.status === 201 || response.status === 200) { // 200 OK também pode ser usado
        setSuccessMessage('Aluno cadastrado com sucesso!');
        // Limpa o formulário após o sucesso
        setNome('');
        setEmail('');
        setMatricula('');
      } else {
        // Se a API retornar um status inesperado mas sem lançar erro
        setError(`Erro inesperado ao cadastrar: Status ${response.status}`);
      }
    } catch (err: any) { // Captura o erro da requisição
      console.error('Erro ao cadastrar aluno:', err);
      // Tenta pegar uma mensagem de erro mais específica da resposta da API, se houver
      const apiErrorMessage = err.response?.data?.message || err.response?.data?.title || err.message;
      setError(`Falha ao cadastrar aluno: ${apiErrorMessage || 'Erro desconhecido'}`);
      setSuccessMessage(null); // Garante que não haja mensagem de sucesso
    } finally {
      setIsLoading(false); // Indica que o envio terminou (com sucesso ou erro)
    }
  };

  // Funções 'onChange' para atualizar os estados (forma mais explícita)
  // const handleNomeChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   setNome(event.target.value);
  // };
  // const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   setEmail(event.target.value);
  // };
  // const handleMatriculaChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   setMatricula(event.target.value);
  // };
  // ---- OU ----
  // Função 'onChange' genérica (usando o atributo 'name' do input)
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    switch (name) {
      case 'nome':
        setNome(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'matricula':
        setMatricula(value);
        break;
      default:
        break;
    }
    // Limpa mensagens ao começar a digitar novamente
    setError(null);
    setSuccessMessage(null);
  };


  return (
    <div>
      <h2>Cadastrar Novo Aluno</h2>
      {/* Formulário com o handler onSubmit */}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nome">Nome:</label>
          <input
            type="text"
            id="nome"
            name="nome" // Importante para o handler genérico
            value={nome}
            // onChange={handleNomeChange} // Forma explícita
            onChange={handleInputChange} // Forma genérica
            required // Validação básica do navegador
            disabled={isLoading} // Desabilita enquanto carrega
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email" // Importante para o handler genérico
            value={email}
            // onChange={handleEmailChange} // Forma explícita
            onChange={handleInputChange} // Forma genérica
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="matricula">Matrícula:</label>
          <input
            type="text"
            id="matricula"
            name="matricula" // Importante para o handler genérico
            value={matricula}
            // onChange={handleMatriculaChange} // Forma explícita
            onChange={handleInputChange} // Forma genérica
            required
            disabled={isLoading}
          />
        </div>

        {/* Feedback para o usuário */}
        {isLoading && <p>Salvando...</p>}
        {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Enviando...' : 'Cadastrar Aluno'}
        </button>
      </form>
    </div>
  );
};

export default CadastrarAluno;