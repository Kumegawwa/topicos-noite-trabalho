import React, { useState, useEffect } from 'react'; // Importa hooks React: useState para gerenciar estado, useEffect para efeitos colaterais (carregamento de dados).
import { useNavigate, useParams } from 'react-router-dom'; // Importa useNavigate para navegação e useParams para obter parâmetros da URL (ID do aluno).
import apiClient from '../../services/api'; // Importa a instância do Axios configurada para a API.
import { Aluno } from '../../models/Aluno'; // Importa a interface Aluno para tipagem.
import './Alunos.css'; // Importa o arquivo CSS para estilização.

// Declaração do componente funcional EditarAluno.
const EditarAluno: React.FC = () => {
    const navigate = useNavigate(); // Hook para obter a função de navegação programática.
    const { id } = useParams<{ id: string }>(); // Obtém o ID do aluno da URL. O tipo é string por padrão, então é preciso converter.

    // Estado para armazenar os dados do aluno a ser editado. Inicializa como null.
    const [aluno, setAluno] = useState<Aluno | null>(null);
    // Estados para controlar o carregamento dos dados e mensagens de erro.
    const [loading, setLoading] = useState<boolean>(true); // Começa como true porque o carregamento inicial é necessário.
    const [error, setError] = useState<string | null>(null);

    // useEffect para buscar os dados do aluno quando o componente é montado ou o ID muda.
    useEffect(() => {
        if (id) {
            // Converte o ID da URL para número inteiro.
            fetchAluno(parseInt(id, 10));
        } else {
            setError("ID do aluno não fornecido."); // Define erro se o ID não estiver na URL.
            setLoading(false); // Desativa o carregamento, pois não há dados para buscar.
        }
    }, [id]); // Dependência: A função será executada novamente se 'id' mudar.

    // Função assíncrona para buscar os dados do aluno na API.
    const fetchAluno = async (alunoId: number) => {
        setLoading(true); // Ativa o estado de carregamento.
        setError(null);   // Limpa erros anteriores.
        try {
            // Faz uma requisição GET para a API para obter os detalhes do aluno.
            const response = await apiClient.get<Aluno>(`/alunos/${alunoId}`);
            // Formata a data de nascimento para "YYYY-MM-DD" para ser compatível com input type="date".
            response.data.dataNascimento = response.data.dataNascimento.split('T')[0];
            setAluno(response.data); // Atualiza o estado com os dados do aluno.
        } catch (err) {
            console.error("Erro ao buscar aluno:", err); // Loga o erro.
            setError('Não foi possível carregar os dados do aluno. Verifique o ID e tente novamente.'); // Define mensagem de erro.
        } finally {
            setLoading(false); // Desativa o carregamento.
        }
    };

    // Função `handleChange`: Atualiza o estado do `aluno` conforme o usuário digita nos campos.
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (aluno) { // Garante que o objeto aluno não é nulo antes de tentar atualizá-lo.
            setAluno(prevAluno => ({
                ...prevAluno!, // Cria uma cópia do aluno anterior. O `!` é uma asserção de não-nulidade.
                [name]: value  // Atualiza o campo específico.
            }));
        }
    };

    // Função `handleSubmit`: Lida com o envio do formulário de edição.
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Previne o recarregamento da página.
        // Valida se o aluno e o ID estão disponíveis antes de prosseguir.
        if (!aluno || !id) {
            setError("Dados do aluno não carregados ou ID inválido.");
            return;
        }

        setLoading(true); // Ativa o carregamento.
        setError(null);   // Limpa erros.

        // Validação básica no frontend para campos obrigatórios.
        if (!aluno.nome || !aluno.email || !aluno.dataNascimento || !aluno.matricula) {
            setError('Todos os campos são obrigatórios.');
            setLoading(false);
            return;
        }

        try {
            // Envia uma requisição PUT para a API para atualizar o aluno.
            await apiClient.put(`/alunos/${id}`, aluno);
            alert('Aluno atualizado com sucesso!'); // Alerta de sucesso.
            navigate('/alunos'); // Redireciona para a lista.
        } catch (err: any) { // Captura erros da requisição.
            console.error("Erro ao atualizar aluno:", err); // Loga o erro.
            // Trata e exibe erros de validação retornados pelo backend.
             if (err.response && err.response.data && err.response.data.errors) {
                const validationErrors = Object.values(err.response.data.errors).flat().join(', ');
                setError(`Erro de validação: ${validationErrors}`);
            } else {
                setError('Erro ao atualizar aluno. Verifique os dados e tente novamente.');
            }
        } finally {
            setLoading(false); // Desativa o carregamento.
        }
    };

    // Condições de renderização para feedback ao usuário.
    if (loading) {
        return <div className="loading">Carregando dados do aluno...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!aluno) {
        return <div className="error-message">Aluno não encontrado.</div>; // Mensagem se o aluno não for encontrado após o carregamento.
    }

    return (
        <div className="alunos-container form-container">
            <h2>Editar Aluno</h2>
            <form onSubmit={handleSubmit}>
                {/* Campos do formulário preenchidos com os dados do aluno. */}
                <div className="form-group">
                    <label htmlFor="nome">Nome:</label>
                    <input
                        type="text"
                        id="nome"
                        name="nome"
                        value={aluno.nome}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={aluno.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="matricula">Matrícula:</label>
                    <input
                        type="text"
                        id="matricula"
                        name="matricula"
                        value={aluno.matricula}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="dataNascimento">Data de Nascimento:</label>
                    <input
                        type="date"
                        id="dataNascimento"
                        name="dataNascimento"
                        value={aluno.dataNascimento}
                        onChange={handleChange}
                        required
                    />
                </div>
                {/* Botão para salvar as alterações. */}
                <button type="submit" className="btn btn-submit" disabled={loading}>
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
                {/* Botão para cancelar a edição e voltar para a lista. */}
                 <button type="button" className="btn btn-cancel" onClick={() => navigate('/alunos')} disabled={loading}>
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default EditarAluno; // Exporta o componente.