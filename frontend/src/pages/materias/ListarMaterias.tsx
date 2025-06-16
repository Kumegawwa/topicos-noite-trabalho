import React, { useState, useEffect } from 'react'; // Importa hooks React: useState para estado, useEffect para efeitos.
import { Link } from 'react-router-dom'; // Importa Link para navegação declarativa.
import apiClient from '../../services/api'; // Importa a instância do Axios para comunicação com a API.
import { Materia } from '../../models/Materia'; // Importa a interface Materia para tipagem.
import './Materias.css'; // Importa o arquivo CSS para estilização específica da seção de Matérias.

// Declaração do componente funcional ListarMaterias.
const ListarMaterias: React.FC = () => {
    // Estado para armazenar a lista de matérias. Inicializa como um array vazio.
    const [materias, setMaterias] = useState<Materia[]>([]);
    // Estados para controlar o carregamento dos dados e mensagens de erro.
    const [loading, setLoading] = useState<boolean>(true); // Inicia como true, pois os dados serão carregados.
    const [error, setError] = useState<string | null>(null); // Mensagem de erro.

    // useEffect para buscar as matérias quando o componente é montado.
    useEffect(() => {
        fetchMaterias(); // Chama a função para buscar as matérias.
    }, []); // Array de dependências vazio para executar apenas uma vez.

    // Função assíncrona para buscar a lista de matérias na API.
    const fetchMaterias = async () => {
        setLoading(true); // Ativa o estado de carregamento.
        setError(null);   // Limpa qualquer mensagem de erro anterior.
        try {
            // Faz uma requisição GET para a API no endpoint '/materias'.
            // A API de matérias inclui os dados do curso associado (`.Include(m => m.Curso)` no backend).
            const response = await apiClient.get<Materia[]>('/materias');
            setMaterias(response.data); // Atualiza o estado 'materias' com os dados recebidos.
        } catch (err) {
            console.error("Erro ao buscar matérias:", err); // Loga o erro.
            setError('Não foi possível carregar a lista de matérias.'); // Define mensagem de erro para exibição.
        } finally {
            setLoading(false); // Desativa o estado de carregamento.
        }
    };

    // Função assíncrona para lidar com a exclusão de uma matéria.
    const handleDelete = async (id: number) => {
        // Confirma com o usuário antes de prosseguir com a exclusão.
        if (window.confirm('Tem certeza que deseja excluir esta matéria?')) {
            try {
                // Envia uma requisição DELETE para a API com o ID da matéria.
                await apiClient.delete(`/materias/${id}`);
                // Atualiza a lista de matérias no estado, removendo a matéria excluída (abordagem otimista).
                setMaterias(materias.filter(materia => materia.id !== id));
                alert('Matéria excluída com sucesso!'); // Alerta de sucesso.
            } catch (err) {
                console.error("Erro ao excluir matéria:", err); // Loga o erro.
                setError('Erro ao excluir matéria.'); // Mensagem de erro.
                alert('Erro ao excluir matéria.'); // Alerta de erro.
            }
        }
    };

    // Renderização condicional baseada no estado de carregamento.
    if (loading) {
        return <div className="loading">Carregando matérias...</div>; // Exibe mensagem de carregamento.
    }

    return (
        <div className="materias-container list-container"> {/* Contêiner principal com classes de estilo. */}
            <h2>Lista de Matérias</h2>
            {error && <p className="error-message">{error}</p>} {/* Exibe a mensagem de erro se houver. */}
            {/* Link para a página de cadastro de uma nova matéria. */}
            <Link to="/materias/cadastrar" className="btn btn-primary mb-3">Cadastrar Nova Matéria</Link>
            {/* Mensagem exibida se não houver matérias e não estiver carregando. */}
            {materias.length === 0 && !loading && <p>Nenhuma matéria cadastrada.</p>}
            {/* Tabela para exibir a lista de matérias, renderizada apenas se houver matérias. */}
            {materias.length > 0 && (
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Curso Associado</th> {/* Coluna para exibir o nome do curso associado. */}
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Mapeia sobre o array de matérias para renderizar uma linha da tabela para cada uma. */}
                        {materias.map((materia) => (
                            <tr key={materia.id}> {/* 'key' é importante para a performance do React. */}
                                <td>{materia.id}</td>
                                <td>{materia.nome}</td>
                                {/* Exibe o nome do curso se o objeto `curso` estiver presente, caso contrário, exibe o ID do curso. */}
                                <td>{materia.curso ? materia.curso.nome : `ID: ${materia.cursoId}`}</td>
                                <td>
                                    {/* Link para a página de edição da matéria. */}
                                    <Link to={`/materias/editar/${materia.id}`} className="btn btn-sm btn-warning me-2">Editar</Link>
                                    {/* Botão de exclusão. Desabilitado se o ID for undefined. */}
                                    <button
                                        onClick={() => handleDelete(materia.id!)} // O '!' afirma que 'materia.id' não será nulo.
                                        className="btn btn-sm btn-danger"
                                        disabled={!materia.id}
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

export default ListarMaterias; // Exporta o componente.