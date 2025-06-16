import React, { useState, useEffect } from 'react'; // Importa hooks React: useState para estado, useEffect para efeitos.
import { useNavigate, useParams } from 'react-router-dom'; // Importa useNavigate para navegação, useParams para obter o ID da URL.
import apiClient from '../../services/api'; // Importa a instância do Axios para comunicação com a API.
import { Curso } from '../../models/Curso'; // Importa a interface Curso para tipagem.
import './Cursos.css'; // Importa o arquivo CSS para estilização.

// Declaração do componente funcional EditarCurso.
const EditarCurso: React.FC = () => {
    const navigate = useNavigate(); // Hook para navegação programática.
    const { id } = useParams<{ id: string }>(); // Obtém o ID do curso da URL.

    // Estado para armazenar os dados do curso a ser editado. Inicializa como null.
    const [curso, setCurso] = useState<Curso | null>(null);
    // Estados para controlar o carregamento e mensagens de erro.
    const [loading, setLoading] = useState<boolean>(true); // Começa como true para indicar o carregamento inicial.
    const [error, setError] = useState<string | null>(null);

    // useEffect para buscar os dados do curso quando o componente é montado ou o ID na URL muda.
    useEffect(() => {
        if (id) {
            fetchCurso(parseInt(id, 10)); // Converte o ID para número e chama a função de busca.
        } else {
            setError("ID do curso não fornecido."); // Define erro se o ID for inválido ou ausente.
            setLoading(false); // Interrompe o carregamento.
        }
    }, [id]); // Dependência: executa o efeito quando o 'id' muda.

    // Função assíncrona para buscar os dados do curso na API.
    const fetchCurso = async (cursoId: number) => {
        setLoading(true); // Ativa o carregamento.
        setError(null);   // Limpa erros anteriores.
        try {
            // Faz uma requisição GET para a API para obter os detalhes do curso.
            const response = await apiClient.get<Curso>(`/cursos/${cursoId}`);
            setCurso(response.data); // Atualiza o estado 'curso' com os dados recebidos.
        } catch (err) {
            console.error("Erro ao buscar curso:", err); // Loga o erro.
            setError('Não foi possível carregar os dados do curso.'); // Mensagem de erro genérica.
        } finally {
            setLoading(false); // Desativa o carregamento.
        }
    };

    // Função `handleChange`: Atualiza o estado do `curso` conforme o usuário digita no campo de nome.
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (curso) { // Garante que `curso` não é null antes de tentar atualizar.
            setCurso(prevCurso => ({
                ...prevCurso!, // Usa o operador '!' para afirmar que prevCurso não é null.
                [name]: value  // Atualiza o campo 'name' (que será 'nome').
            }));
        }
    };

    // Função `handleSubmit`: Lida com o envio do formulário de edição de curso.
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Previne o recarregamento da página.
        // Valida se `curso` e `id` estão presentes.
        if (!curso || !id) {
            setError("Dados do curso não carregados ou ID inválido.");
            return;
        }

        setLoading(true); // Ativa o carregamento.
        setError(null);   // Limpa erros.

        // Validação básica no frontend para o campo de nome.
        if (!curso.nome) {
            setError('O nome do curso é obrigatório.');
            setLoading(false);
            return;
        }

        try {
            // Envia uma requisição PUT para a API para atualizar o curso.
            // A API espera um objeto com a propriedade `nome`.
            await apiClient.put(`/cursos/${id}`, { nome: curso.nome });
            alert('Curso atualizado com sucesso!'); // Alerta de sucesso.
            navigate('/cursos'); // Redireciona para a página de listagem.
        } catch (err: any) { // Captura erros da requisição.
            console.error("Erro ao atualizar curso:", err); // Loga o erro.
            // Trata e exibe mensagens de erro de validação vindas do backend.
            if (err.response && err.response.data && err.response.data.errors) {
                const validationErrors = Object.values(err.response.data.errors).flat().join(', ');
                setError(`Erro de validação: ${validationErrors}`);
            } else {
                setError('Erro ao atualizar curso. Tente novamente.');
            }
        } finally {
            setLoading(false); // Desativa o carregamento.
        }
    };

    // Renderização condicional baseada nos estados.
    if (loading) {
        return <div className="loading">Carregando dados do curso...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!curso) {
        return <div className="error-message">Curso não encontrado.</div>; // Caso o curso não seja encontrado.
    }

    return (
        <div className="cursos-container form-container">
            <h2>Editar Curso</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="nome">Nome do Curso:</label>
                    <input
                        type="text"
                        id="nome"
                        name="nome"
                        value={curso.nome} // O valor do input é vinculado ao estado 'curso.nome'.
                        onChange={handleChange}
                        required
                    />
                </div>
                {/* Botão para salvar as alterações. */}
                <button type="submit" className="btn btn-submit" disabled={loading}>
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
                {/* Botão para cancelar e voltar à lista. */}
                <button type="button" className="btn btn-cancel" onClick={() => navigate('/cursos')} disabled={loading}>
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default EditarCurso; // Exporta o componente.