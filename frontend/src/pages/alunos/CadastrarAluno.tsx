import React, { useState } from 'react'; // Importa hooks React: useState para gerenciar estado do componente.
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para navegação programática após o cadastro.
import apiClient from '../../services/api'; // Importa a instância do Axios configurada para a API.
import { Aluno } from '../../models/Aluno'; // Importa a interface Aluno para tipagem dos dados.
import './Alunos.css'; // Importa o arquivo CSS para estilização específica da seção de Alunos.

// Declaração do componente funcional CadastrarAluno.
const CadastrarAluno: React.FC = () => {
    const navigate = useNavigate(); // Hook para obter a função de navegação.

    // Estado para armazenar os dados do novo aluno.
    // Inicializa com campos vazios, incluindo 'dataNascimento' como string para compatibilidade com input type="date".
    const [aluno, setAluno] = useState<Aluno>({
        nome: '',
        email: '',
        dataNascimento: '',
        matricula: ''
    });
    // Estados para controlar o estado de carregamento e mensagens de erro.
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Função `handleChange`: Atualiza o estado do `aluno` conforme o usuário digita nos campos do formulário.
    // e.target.name: O atributo 'name' do input, que corresponde à chave no objeto `aluno`.
    // e.target.value: O valor atual do input.
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAluno(prevAluno => ({
            ...prevAluno, // Mantém os outros campos do aluno inalterados.
            [name]: value // Atualiza apenas o campo que mudou.
        }));
    };

    // Função `handleSubmit`: Lida com o envio do formulário de cadastro.
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Previne o comportamento padrão de recarregar a página ao enviar o formulário.
        setLoading(true);    // Ativa o estado de carregamento.
        setError(null);      // Limpa qualquer mensagem de erro anterior.

        // Validação básica no frontend para campos obrigatórios.
        if (!aluno.nome || !aluno.email || !aluno.dataNascimento || !aluno.matricula) {
            setError('Todos os campos são obrigatórios.'); // Define uma mensagem de erro.
            setLoading(false); // Desativa o carregamento.
            return; // Interrompe a função.
        }

        try {
            // Envia uma requisição POST para a API com os dados do novo aluno.
            await apiClient.post('/alunos', aluno);
            alert('Aluno cadastrado com sucesso!'); // Exibe um alerta de sucesso.
            navigate('/alunos'); // Redireciona o usuário para a página de listagem de alunos.
        } catch (err: any) { // Captura erros que podem ocorrer durante a requisição.
            console.error("Erro ao cadastrar aluno:", err); // Loga o erro no console para depuração.
            // Verifica se a resposta do erro contém informações de validação do backend (Data Annotations).
            if (err.response && err.response.data && err.response.data.errors) {
                // Concatena as mensagens de erro de validação do backend em uma única string.
                const validationErrors = Object.values(err.response.data.errors).flat().join(', ');
                setError(`Erro de validação: ${validationErrors}`); // Define o erro de validação.
            } else {
                setError('Erro ao cadastrar aluno. Verifique os dados e tente novamente.'); // Erro genérico.
            }
        } finally {
            setLoading(false); // Desativa o estado de carregamento, independentemente do sucesso ou falha.
        }
    };

    return (
        <div className="alunos-container form-container"> {/* Contêiner principal com classes de estilo. */}
            <h2>Cadastrar Novo Aluno</h2>
            {error && <p className="error-message">{error}</p>} {/* Exibe a mensagem de erro se houver. */}
            <form onSubmit={handleSubmit}> {/* Formulário com o manipulador de envio. */}
                {/* Campo de input para o Nome do aluno. */}
                <div className="form-group">
                    <label htmlFor="nome">Nome:</label>
                    <input
                        type="text"
                        id="nome"
                        name="nome"
                        value={aluno.nome}
                        onChange={handleChange}
                        required // Campo obrigatório (validação HTML5).
                    />
                </div>
                {/* Campo de input para o Email do aluno. */}
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={aluno.email}
                        onChange={handleChange}
                        required // Campo obrigatório.
                    />
                </div>
                {/* Campo de input para a Matrícula do aluno. */}
                <div className="form-group">
                    <label htmlFor="matricula">Matrícula:</label>
                    <input
                        type="text"
                        id="matricula"
                        name="matricula"
                        value={aluno.matricula}
                        onChange={handleChange}
                        required // Campo obrigatório.
                    />
                </div>
                {/* Campo de input para a Data de Nascimento do aluno. */}
                <div className="form-group">
                    <label htmlFor="dataNascimento">Data de Nascimento:</label>
                    <input
                        type="date" // Tipo "date" para exibir um seletor de data.
                        id="dataNascimento"
                        name="dataNascimento"
                        value={aluno.dataNascimento}
                        onChange={handleChange}
                        required // Campo obrigatório.
                    />
                </div>
                {/* Botão de submit do formulário. Desabilitado durante o carregamento. */}
                <button type="submit" className="btn btn-submit" disabled={loading}>
                    {loading ? 'Cadastrando...' : 'Cadastrar Aluno'}
                </button>
                {/* Botão de cancelar, que redireciona para a lista de alunos. */}
                <button type="button" className="btn btn-cancel" onClick={() => navigate('/alunos')} disabled={loading}>
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default CadastrarAluno; // Exporta o componente para ser usado em outras partes da aplicação.