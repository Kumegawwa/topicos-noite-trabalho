import React, { useState, useEffect } from 'react'; // Importa hooks React: useState para gerenciar estado, useEffect para efeitos.
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para navegação programática.
import apiClient from '../../services/api'; // Importa a instância do Axios para comunicação com a API.
import { Materia } from '../../models/Materia'; // Importa a interface Materia para tipagem.
import { Curso } from '../../models/Curso'; // Importa a interface Curso para popular o dropdown de seleção.
import './Materias.css'; // Importa o arquivo CSS para estilização específica da seção de Matérias.

// Declaração do componente funcional CadastrarMateria.
const CadastrarMateria: React.FC = () => {
    const navigate = useNavigate(); // Hook para navegação programática.

    // Estado para a nova matéria a ser cadastrada.
    // 'cursoId' é inicializado com 0 ou um valor inválido para forçar a seleção de um curso.
    const [materia, setMateria] = useState<Materia>({
        nome: '',
        cursoId: 0,
    });
    // Estado para a lista de cursos, usada para popular o dropdown.
    const [cursos, setCursos] = useState<Curso[]>([]);
    // Estados para controle de carregamento (geral do formulário e específico para cursos) e erros.
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingCursos, setLoadingCursos] = useState<boolean>(true); // Indica que os cursos estão sendo carregados inicialmente.
    const [error, setError] = useState<string | null>(null);

    // useEffect para buscar a lista de cursos quando o componente é montado.
    useEffect(() => {
        fetchCursos();
    }, []); // Array de dependências vazio para executar apenas uma vez.

    // Função assíncrona para buscar todos os cursos da API.
    const fetchCursos = async () => {
        setLoadingCursos(true); // Ativa o carregamento de cursos.
        try {
            const response = await apiClient.get<Curso[]>('/cursos');
            setCursos(response.data); // Atualiza o estado com a lista de cursos.
            // Se houver cursos, seleciona o primeiro por padrão no dropdown, melhorando a UX.
            if (response.data.length > 0) {
                setMateria(prev => ({ ...prev, cursoId: response.data[0].id! }));
            }
        } catch (err) {
            console.error("Erro ao buscar cursos:", err); // Loga o erro.
            setError('Não foi possível carregar a lista de cursos para seleção.'); // Define mensagem de erro.
        } finally {
            setLoadingCursos(false); // Desativa o carregamento de cursos.
        }
    };

    // Função `handleChange`: Atualiza o estado da `materia` conforme o usuário digita/seleciona.
    // Lida com inputs de texto e seleções de dropdown.
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setMateria(prevMateria => ({
            ...prevMateria,
            // Converte `value` para número se o campo for `cursoId`, caso contrário, mantém como string.
            [name]: name === 'cursoId' ? parseInt(value, 10) : value
        }));
    };

    // Função `handleSubmit`: Lida com o envio do formulário.
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Previne o recarregamento da página.
        setLoading(true);    // Ativa o carregamento.
        setError(null);      // Limpa erros anteriores.

        // Validação básica no frontend para campos obrigatórios.
        // Garante que o nome da matéria e um curso válido sejam selecionados.
        if (!materia.nome || materia.cursoId <= 0) {
            setError('O nome da matéria e a seleção de um curso são obrigatórios.');
            setLoading(false);
            return;
        }

        try {
            // Envia uma requisição POST para a API para cadastrar a nova matéria.
            await apiClient.post('/materias', materia);
            alert('Matéria cadastrada com sucesso!'); // Alerta de sucesso.
            navigate('/materias'); // Redireciona para a página de listagem de matérias.
        } catch (err: any) { // Captura erros da requisição.
            console.error("Erro ao cadastrar matéria:", err); // Loga o erro.
            let errorMsg = 'Erro ao cadastrar matéria. Verifique os dados e tente novamente.'; // Mensagem padrão.
            // Verifica e extrai mensagens de erro de validação do backend (se disponíveis).
            if (err.response && err.response.data) {
                 if (typeof err.response.data === 'string') {
                    errorMsg = err.response.data; // Se a resposta for uma string de erro.
                 } else if (err.response.data.errors) {
                    // Concatena múltiplos erros de validação.
                    const validationErrors = Object.values(err.response.data.errors).flat().join(', ');
                    errorMsg = `Erro de validação: ${validationErrors}`;
                 }
            }
            setError(errorMsg); // Define a mensagem de erro.
        } finally {
            setLoading(false); // Desativa o carregamento.
        }
    };

    return (
        <div className="materias-container form-container">
            <h2>Cadastrar Nova Matéria</h2>
            {error && <p className="error-message">{error}</p>} {/* Exibe erro se houver. */}
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
                        value={materia.cursoId}
                        onChange={handleChange}
                        required
                        // Desabilita o select enquanto os cursos estão carregando ou se não houver cursos.
                        disabled={loadingCursos || cursos.length === 0}
                    >
                        {/* Opção padrão desabilitada para forçar a seleção. */}
                        <option value="0" disabled>Selecione um curso...</option>
                        {loadingCursos ? (
                            <option disabled>Carregando cursos...</option> // Mensagem enquanto carrega.
                        ) : (
                            // Mapeia a lista de cursos para criar as opções do dropdown.
                            cursos.map(curso => (
                                <option key={curso.id} value={curso.id!}>
                                    {curso.nome}
                                </option>
                            ))
                        )}
                    </select>
                    {/* Mensagem se nenhum curso for encontrado para associar. */}
                    {cursos.length === 0 && !loadingCursos && <p style={{ color: 'red', fontSize: '0.9em', marginTop: '5px' }}>Nenhum curso encontrado para associar.</p>}
                </div>
                {/* Botão de submit. Desabilitado se estiver carregando, ou se não houver cursos para associar. */}
                <button type="submit" className="btn btn-submit" disabled={loading || loadingCursos || cursos.length === 0}>
                    {loading ? 'Cadastrando...' : 'Cadastrar Matéria'}
                </button>
                {/* Botão de cancelar. */}
                <button type="button" className="btn btn-cancel" onClick={() => navigate('/materias')} disabled={loading}>
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default CadastrarMateria; // Exporta o componente.