import React, { useState, useEffect } from 'react'; // Importa hooks React: useState para estado, useEffect para efeitos (carregamento inicial).
import { Link } from 'react-router-dom'; // Importa Link para navegação declarativa.
import apiClient from '../../services/api'; // Importa a instância do Axios configurada para a API.
import { Aluno } from '../../models/Aluno'; // Importa a interface Aluno para tipagem.
import './Alunos.css'; // Importa o arquivo CSS para estilização específica da seção de Alunos.

// Declaração do componente funcional ListarAlunos.
const ListarAlunos: React.FC = () => {
    // Estado para armazenar a lista de alunos. Inicializa como um array vazio.
    const [alunos, setAlunos] = useState<Aluno[]>([]);
    // Estados para controlar o carregamento dos dados e mensagens de erro.
    const [loading, setLoading] = useState<boolean>(true); // Inicia como true, pois os dados serão carregados ao montar.
    const [error, setError] = useState<string | null>(null);

    // useEffect para buscar os alunos quando o componente é montado.
    useEffect(() => {
        fetchAlunos(); // Chama a função para buscar os alunos.
    }, []); // O array de dependências vazio [] garante que esta função seja executada apenas uma vez, na montagem.

    // Função assíncrona para buscar a lista de alunos na API.
    const fetchAlunos = async () => {
        setLoading(true); // Ativa o estado de carregamento.
        setError(null);   // Limpa qualquer mensagem de erro anterior.
        try {
            // Faz uma requisição GET para a API no endpoint '/alunos'.
            const response = await apiClient.get<Aluno[]>('/alunos');
            setAlunos(response.data); // Atualiza o estado 'alunos' com os dados recebidos da API.
        } catch (err) {
            console.error("Erro ao buscar alunos:", err); // Loga o erro no console para depuração.
            setError('Não foi possível carregar a lista de alunos. Tente novamente mais tarde.'); // Define uma mensagem de erro para exibição.
        } finally {
            setLoading(false); // Desativa o estado de carregamento, independentemente do sucesso ou falha da requisição.
        }
    };

    // Função assíncrona para lidar com a exclusão de um aluno.
    const handleDelete = async (id: number) => {
        // Confirma com o usuário antes de prosseguir com a exclusão.
        if (window.confirm('Tem certeza que deseja excluir este aluno?')) {
            try {
                // Envia uma requisição DELETE para a API com o ID do aluno a ser excluído.
                await apiClient.delete(`/alunos/${id}`);
                // Atualiza a lista de alunos no estado, removendo o aluno excluído (otimista).
                setAlunos(alunos.filter(aluno => aluno.id !== id));
                alert('Aluno excluído com sucesso!'); // Alerta de sucesso.
            } catch (err) {
                console.error("Erro ao excluir aluno:", err); // Loga o erro.
                setError('Erro ao excluir aluno. Verifique se ele não possui dependências.'); // Mensagem de erro.
                alert('Erro ao excluir aluno.'); // Alerta de erro.
            }
        }
    };

    // Renderização condicional baseada no estado de carregamento.
    if (loading) {
        return <div className="loading">Carregando alunos...</div>; // Exibe mensagem de carregamento.
    }

    return (
        <div className="alunos-container list-container"> {/* Contêiner principal com classes de estilo. */}
            <h2>Lista de Alunos</h2>
            {error && <p className="error-message">{error}</p>} {/* Exibe a mensagem de erro se houver. */}
            {/* Link para a página de cadastro de um novo aluno. */}
            <Link to="/alunos/cadastrar" className="btn btn-primary mb-3">Cadastrar Novo Aluno</Link>
            {/* Mensagem exibida se não houver alunos cadastrados e não estiver carregando. */}
            {alunos.length === 0 && !loading && <p>Nenhum aluno cadastrado.</p>}
            {/* Tabela para exibir a lista de alunos, renderizada apenas se houver alunos. */}
            {alunos.length > 0 && (
                <table className="table table-striped table-hover">
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
                        {/* Mapeia sobre o array de alunos para renderizar uma linha da tabela para cada um. */}
                        {alunos.map((aluno) => (
                            <tr key={aluno.id}> {/* 'key' é importante para a performance do React em listas. */}
                                <td>{aluno.id}</td>
                                <td>{aluno.nome}</td>
                                <td>{aluno.email}</td>
                                <td>{aluno.matricula}</td>
                                {/* Formata a data de nascimento para um formato legível. */}
                                <td>{new Date(aluno.dataNascimento).toLocaleDateString()}</td>
                                <td>
                                    {/* Link para a página de edição do aluno, passando o ID na URL. */}
                                    <Link to={`/alunos/editar/${aluno.id}`} className="btn btn-sm btn-warning me-2">Editar</Link>
                                    {/* Botão de exclusão. Desabilitado se o ID do aluno for undefined (embora improvável aqui). */}
                                    <button
                                        onClick={() => handleDelete(aluno.id!)} // O '!' afirma que 'aluno.id' não será nulo neste ponto.
                                        className="btn btn-sm btn-danger"
                                        disabled={!aluno.id} // Desabilita o botão se o ID não estiver presente (segurança extra).
                                    >
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ListarAlunos; // Exporta o componente para ser usado em outras partes da aplicação.