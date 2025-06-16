import React, { useState, useEffect } from 'react'; // Importa hooks React: useState para estado, useEffect para efeitos.
import { Link } from 'react-router-dom'; // Importa Link para navegação declarativa.
import apiClient from '../../services/api'; // Importa a instância do Axios para comunicação com a API.
import { Curso } from '../../models/Curso'; // Importa a interface Curso para tipagem.
import './Cursos.css'; // Importa o arquivo CSS para estilização específica da seção de Cursos.

// Declaração do componente funcional ListarCursos.
const ListarCursos: React.FC = () => {
    // Estado para armazenar a lista de cursos. Inicializa como um array vazio.
    const [cursos, setCursos] = useState<Curso[]>([]);
    // Estados para controlar o carregamento dos dados e mensagens de erro.
    const [loading, setLoading] = useState<boolean>(true); // Inicia como true, pois os dados serão carregados ao montar.
    const [error, setError] = useState<string | null>(null);

    // useEffect para buscar os cursos quando o componente é montado.
    useEffect(() => {
        fetchCursos(); // Chama a função para buscar os cursos.
    }, []); // Array de dependências vazio [] garante que a função seja executada apenas uma vez na montagem.

    // Função assíncrona para buscar a lista de cursos na API.
    const fetchCursos = async () => {
        setLoading(true); // Ativa o estado de carregamento.
        setError(null);   // Limpa qualquer mensagem de erro anterior.
        try {
            // Faz uma requisição GET para a API no endpoint '/cursos'.
            // A API de cursos retorna os cursos com suas matérias associadas (.Include(c => c.Materias)).
            const response = await apiClient.get<Curso[]>('/cursos');
            setCursos(response.data); // Atualiza o estado 'cursos' com os dados recebidos.
        } catch (err) {
            console.error("Erro ao buscar cursos:", err); // Loga o erro no console.
            setError('Não foi possível carregar a lista de cursos.'); // Define mensagem de erro para exibição.
        } finally {
            setLoading(false); // Desativa o estado de carregamento.
        }
    };

    // Função assíncrona para lidar com a exclusão de um curso.
    const handleDelete = async (id: number) => {
        // Confirma com o usuário antes de prosseguir com a exclusão, incluindo uma nota sobre dependências.
        if (window.confirm('Tem certeza que deseja excluir este curso? A exclusão só será permitida se não houver matérias associadas.')) {
            try {
                // Envia uma requisição DELETE para a API para excluir o curso.
                await apiClient.delete(`/cursos/${id}`);
                // Atualiza a lista de cursos no estado, removendo o curso excluído (abordagem otimista).
                setCursos(cursos.filter(curso => curso.id !== id));
                alert('Curso excluído com sucesso!'); // Alerta de sucesso.
            } catch (err: any) { // Captura erros que podem incluir mensagens de erro do backend.
                console.error("Erro ao excluir curso:", err); // Loga o erro.
                let errorMsg = 'Erro ao excluir curso.'; // Mensagem de erro padrão.
                // Verifica se a resposta de erro da API contém uma mensagem específica.
                if (err.response && err.response.data && typeof err.response.data === 'string') {
                    errorMsg = err.response.data; // Se o backend retornar uma string de erro.
                } else if (err.response && err.response.status === 400) {
                     // Caso a API retorne um erro 400, pode ser a validação de que o curso tem matérias.
                     errorMsg = 'Não é possível excluir o curso pois ele possui matérias associadas.';
                }
                setError(errorMsg); // Define a mensagem de erro para exibição.
                alert(errorMsg); // Exibe um alerta com a mensagem de erro.
            }
        }
    };

    // Renderização condicional baseada no estado de carregamento.
    if (loading) {
        return <div className="loading">Carregando cursos...</div>; // Exibe mensagem de carregamento.
    }

    return (
        <div className="cursos-container list-container"> {/* Contêiner principal com classes de estilo. */}
            <h2>Lista de Cursos</h2>
            {error && <p className="error-message">{error}</p>} {/* Exibe a mensagem de erro se houver. */}
            {/* Link para a página de cadastro de um novo curso. */}
            <Link to="/cursos/cadastrar" className="btn btn-primary mb-3">Cadastrar Novo Curso</Link>
            {/* Mensagem exibida se não houver cursos cadastrados e não estiver carregando. */}
            {cursos.length === 0 && !loading && <p>Nenhum curso cadastrado.</p>}
            {/* Tabela para exibir a lista de cursos, renderizada apenas se houver cursos. */}
            {cursos.length > 0 && (
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Nº Matérias</th> {/* Exibe o número de matérias associadas. */}
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Mapeia sobre o array de cursos para renderizar uma linha da tabela para cada um. */}
                        {cursos.map((curso) => (
                            <tr key={curso.id}> {/* 'key' é essencial para otimização de listas no React. */}
                                <td>{curso.id}</td>
                                <td>{curso.nome}</td>
                                {/* Acessa o comprimento do array de matérias (se existir) ou 0 se for null/undefined. */}
                                <td>{curso.materias?.length ?? 0}</td>
                                <td>
                                    {/* Link para a página de edição do curso. */}
                                    <Link to={`/cursos/editar/${curso.id}`} className="btn btn-sm btn-warning me-2">Editar</Link>
                                    {/* Botão de exclusão. Desabilitado se o ID do curso for undefined. */}
                                    <button
                                        onClick={() => handleDelete(curso.id!)} // O '!' afirma que 'curso.id' não será nulo.
                                        className="btn btn-sm btn-danger"
                                        disabled={!curso.id}
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

export default ListarCursos; // Exporta o componente.