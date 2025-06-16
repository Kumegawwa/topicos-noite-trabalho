import React, { useState, useEffect } from 'react'; // Importa hooks React: useState para estado, useEffect para efeitos.
import { useNavigate, useParams } from 'react-router-dom'; // Importa useNavigate para navegação, useParams para obter o ID da URL.
import apiClient from '../../services/api'; // Importa a instância do Axios para comunicação com a API.
import { Materia } from '../../models/Materia'; // Importa a interface Materia para tipagem.
import { Curso } from '../../models/Curso'; // Importa a interface Curso para popular o dropdown de seleção.
import './Materias.css'; // Importa o arquivo CSS para estilização.

// Declaração do componente funcional EditarMateria.
const EditarMateria: React.FC = () => {
    const navigate = useNavigate(); // Hook para navegação programática.
    const { id } = useParams<{ id: string }>(); // Obtém o ID da matéria da URL.

    // Estados para os dados da matéria, lista de cursos, estados de carregamento e erro.
    const [materia, setMateria] = useState<Materia | null>(null); // Matéria a ser editada.
    const [cursos, setCursos] = useState<Curso[]>([]); // Lista de cursos para o dropdown.
    const [loading, setLoading] = useState<boolean>(true); // Estado de carregamento geral.
    const [loadingCursos, setLoadingCursos] = useState<boolean>(true); // Estado de carregamento dos cursos.
    const [error, setError] = useState<string | null>(null); // Mensagem de erro.

    // Primeiro useEffect: Busca a lista de cursos ao montar o componente.
    useEffect(() => {
        fetchCursos();
    }, []); // Array de dependências vazio para executar apenas uma vez.

    // Segundo useEffect: Busca os dados da matéria SOMENTE APÓS os cursos terem sido carregados.
    // Isso garante que o dropdown de cursos esteja pronto ao preencher o formulário.
    useEffect(() => {
        if (!loadingCursos && id) { // Verifica se os cursos terminaram de carregar e se o ID da matéria está disponível.
            fetchMateria(parseInt(id, 10)); // Busca os dados da matéria.
        } else if (!id) {
            setError("ID da matéria não fornecido."); // Erro se ID estiver faltando.
            setLoading(false); // Finaliza o estado de carregamento.
        }
    }, [id, loadingCursos]); // Dependências: executa quando 'id' ou 'loadingCursos' muda.

    // Função assíncrona para buscar a lista de cursos.
    const fetchCursos = async () => {
        setLoadingCursos(true); // Ativa carregamento de cursos.
        try {
            const response = await apiClient.get<Curso[]>('/cursos');
            setCursos(response.data); // Atualiza o estado 'cursos'.
        } catch (err) {
            console.error("Erro ao buscar cursos:", err);
            setError('Não foi possível carregar a lista de cursos para seleção.');
        } finally {
            setLoadingCursos(false); // Desativa carregamento de cursos.
        }
    };

    // Função assíncrona para buscar os dados da matéria específica.
    const fetchMateria = async (materiaId: number) => {
        setLoading(true); // Ativa carregamento geral.
        setError(null);   // Limpa erros.
        try {
            const response = await apiClient.get<Materia>(`/materias/${materiaId}`);
            setMateria(response.data); // Atualiza o estado 'materia'.
        } catch (err) {
            console.error("Erro ao buscar matéria:", err);
            setError('Não foi possível carregar os dados da matéria.');
        } finally {
            setLoading(false); // Desativa carregamento geral.
        }
    };

    // Função `handleChange`: Atualiza o estado da `materia` conforme o usuário digita/seleciona.
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (materia) { // Garante que a matéria não é nula.
            setMateria(prevMateria => ({
                ...prevMateria!, // Asserção de não-nulidade.
                [name]: name === 'cursoId' ? parseInt(value, 10) : value // Converte cursoId para número.
            }));
        }
    };

    // Função `handleSubmit`: Lida com o envio do formulário de edição.
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Previne recarregamento da página.
        // Validação inicial para garantir que matéria e ID estejam disponíveis.
        if (!materia || !id) {
            setError("Dados da matéria não carregados ou ID inválido.");
            return;
        }

        setLoading(true); // Ativa carregamento.
        setError(null);   // Limpa erros.

        // Validação básica no frontend para campos obrigatórios.
        if (!materia.nome || materia.cursoId <= 0) {
            setError('O nome da matéria e a seleção de um curso são obrigatórios.');
            setLoading(false);
            return;
        }

        try {
            // Envia uma requisição PUT para a API com os dados atualizados da matéria.
            // Envia apenas 'nome' e 'cursoId'.
            await apiClient.put(`/materias/${id}`, { nome: materia.nome, cursoId: materia.cursoId });
            alert('Matéria atualizada com sucesso!'); // Alerta de sucesso.
            navigate('/materias'); // Redireciona para a lista.
        } catch (err: any) { // Captura erros da requisição.
            console.error("Erro ao atualizar matéria:", err);
            let errorMsg = 'Erro ao atualizar matéria. Verifique os dados e tente novamente.';
            // Trata e exibe mensagens de erro de validação do backend.
             if (err.response && err.response.data) {
                 if (typeof err.response.data === 'string') {
                    errorMsg = err.response.data;
                 } else if (err.response.data.errors) {
                    const validationErrors = Object.values(err.response.data.errors).flat().join(', ');
                    errorMsg = `Erro de validação: ${validationErrors}`;
                 }
            }
            setError(errorMsg);
        } finally {
            setLoading(false); // Desativa carregamento.
        }
    };

    // Renderização condicional para feedback ao usuário.
    if (loading || loadingCursos) {
        return <div className="loading">Carregando dados...</div>; // Exibe mensagem de carregamento.
    }

    if (error && !materia) { // Exibe erro se não houver matéria carregada e houver erro.
        return <div className="error-message">{error}</div>;
    }

    if (!materia) { // Exibe se a matéria não for encontrada após o carregamento.
         return <div className="error-message">Matéria não encontrada.</div>;
    }

    return (
        <div className="materias-container form-container">
            <h2>Editar Matéria</h2>
            {error && materia && <p className="error-message">{error}</p>} {/* Exibe erro se houver. */}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="nome">Nome da Matéria:</label>
                    <input
                        type="text"
                        id="nome"
                        name="nome"
                        value={materia.nome}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="cursoId">Curso Associado:</label>
                    <select
                        id="cursoId"
                        name="cursoId"
                        value={materia.cursoId} // Valor vinculado ao cursoId da matéria.
                        onChange={handleChange}
                        required
                        disabled={cursos.length === 0} // Desabilita se não houver cursos para selecionar.
                    >
                        <option value="0" disabled>Selecione um curso...</option>
                        {/* Mapeia a lista de cursos para criar as opções do dropdown. */}
                        {
                            cursos.map(curso => (
                                <option key={curso.id} value={curso.id!}>
                                    {curso.nome}
                                </option>
                            ))
                        }
                    </select>
                     {cursos.length === 0 && <p style={{ color: 'red', fontSize: '0.9em', marginTop: '5px' }}>Nenhum curso encontrado para associar.</p>}
                </div>
                {/* Botão de submit. */}
                <button type="submit" className="btn btn-submit" disabled={loading}>
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
                {/* Botão de cancelar. */}
                <button type="button" className="btn btn-cancel" onClick={() => navigate('/materias')} disabled={loading}>
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default EditarMateria; // Exporta o componente.