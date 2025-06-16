import React, { useState } from 'react'; // Importa hooks React: useState para gerenciar estado.
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para navegação programática.
import apiClient from '../../services/api'; // Importa a instância do Axios para comunicação com a API.
import { Curso } from '../../models/Curso'; // Importa a interface Curso para tipagem.
import './Cursos.css'; // Importa o arquivo CSS para estilização específica da seção de Cursos.

// Declaração do componente funcional CadastrarCurso.
const CadastrarCurso: React.FC = () => {
    const navigate = useNavigate(); // Hook para obter a função de navegação.

    // Estado para armazenar os dados do novo curso.
    // Inicializa com um objeto Curso, onde 'nome' é uma string vazia.
    const [curso, setCurso] = useState<Curso>({
        nome: '',
    });
    // Estados para controlar o estado de carregamento e mensagens de erro.
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Função `handleChange`: Atualiza o estado do `curso` conforme o usuário digita no campo de nome.
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurso(prevCurso => ({
            ...prevCurso, // Mantém outras propriedades (se houver) inalteradas.
            [name]: value // Atualiza o valor da propriedade 'nome'.
        }));
    };

    // Função `handleSubmit`: Lida com o envio do formulário de cadastro de curso.
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Previne o comportamento padrão de recarregar a página.
        setLoading(true);    // Ativa o estado de carregamento.
        setError(null);      // Limpa qualquer mensagem de erro anterior.

        // Validação básica no frontend para o campo de nome.
        if (!curso.nome) {
            setError('O nome do curso é obrigatório.'); // Define mensagem de erro.
            setLoading(false); // Desativa o carregamento.
            return; // Interrompe a função.
        }

        try {
            // Envia uma requisição POST para a API para cadastrar o novo curso.
            await apiClient.post('/cursos', curso);
            alert('Curso cadastrado com sucesso!'); // Exibe um alerta de sucesso.
            navigate('/cursos'); // Redireciona para a página de listagem de cursos.
        } catch (err: any) { // Captura erros da requisição.
            console.error("Erro ao cadastrar curso:", err); // Loga o erro para depuração.
            // Verifica se o erro contém informações de validação do backend.
            if (err.response && err.response.data && err.response.data.errors) {
                // Concatena as mensagens de erro de validação (se forem um array de erros).
                const validationErrors = Object.values(err.response.data.errors).flat().join(', ');
                setError(`Erro de validação: ${validationErrors}`); // Define o erro de validação.
            } else {
                setError('Erro ao cadastrar curso. Tente novamente.'); // Erro genérico.
            }
        } finally {
            setLoading(false); // Desativa o estado de carregamento.
        }
    };

    return (
        <div className="cursos-container form-container"> {/* Contêiner principal com classes de estilo. */}
            <h2>Cadastrar Novo Curso</h2>
            {error && <p className="error-message">{error}</p>} {/* Exibe a mensagem de erro se houver. */}
            <form onSubmit={handleSubmit}> {/* Formulário com o manipulador de envio. */}
                <div className="form-group">
                    <label htmlFor="nome">Nome do Curso:</label>
                    <input
                        type="text"
                        id="nome"
                        name="nome"
                        value={curso.nome}
                        onChange={handleChange}
                        required // Campo obrigatório (validação HTML5).
                    />
                </div>
                {/* Botão de submit do formulário. Desabilitado durante o carregamento. */}
                <button type="submit" className="btn btn-submit" disabled={loading}>
                    {loading ? 'Cadastrando...' : 'Cadastrar Curso'}
                </button>
                {/* Botão de cancelar, que redireciona para a lista de cursos. */}
                <button type="button" className="btn btn-cancel" onClick={() => navigate('/cursos')} disabled={loading}>
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default CadastrarCurso; // Exporta o componente.