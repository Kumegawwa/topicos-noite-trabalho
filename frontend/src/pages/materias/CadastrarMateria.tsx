import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/api';
import { Materia } from '../../models/Materia';
import { Curso } from '../../models/Curso'; // Para listar cursos no select
import './Materias.css'; // Reutiliza os estilos

const CadastrarMateria: React.FC = () => {
    const navigate = useNavigate();
    const [materia, setMateria] = useState<Materia>({
        nome: '',
        cursoId: 0, // Inicializa com 0 ou um valor inválido
    });
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingCursos, setLoadingCursos] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCursos();
    }, []);

    const fetchCursos = async () => {
        setLoadingCursos(true);
        try {
            const response = await apiClient.get<Curso[]>('/cursos');
            setCursos(response.data);
            if (response.data.length > 0) {
                setMateria(prev => ({ ...prev, cursoId: response.data[0].id! }));
            }
        } catch (err) {
            console.error("Erro ao buscar cursos:", err);
            setError('Não foi possível carregar a lista de cursos para seleção.');
        } finally {
            setLoadingCursos(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setMateria(prevMateria => ({
            ...prevMateria,
            [name]: name === 'cursoId' ? parseInt(value, 10) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!materia.nome || materia.cursoId <= 0) {
            setError('O nome da matéria e a seleção de um curso são obrigatórios.');
            setLoading(false);
            return;
        }

        try {
            await apiClient.post('/materias', materia);
            alert('Matéria cadastrada com sucesso!');
            navigate('/materias'); // Redireciona para a lista
        } catch (err: any) {
            console.error("Erro ao cadastrar matéria:", err);
            let errorMsg = 'Erro ao cadastrar matéria. Verifique os dados e tente novamente.';
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
            setLoading(false);
        }
    };

    return (
        <div className="materias-container form-container">
            <h2>Cadastrar Nova Matéria</h2>
            {error && <p className="error-message">{error}</p>}
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
                        disabled={loadingCursos || cursos.length === 0}
                    >
                        <option value="0" disabled>Selecione um curso...</option>
                        {loadingCursos ? (
                            <option disabled>Carregando cursos...</option>
                        ) : (
                            cursos.map(curso => (
                                <option key={curso.id} value={curso.id!}>
                                    {curso.nome}
                                </option>
                            ))
                        )}
                    </select>
                    {cursos.length === 0 && !loadingCursos && <p style={{ color: 'red', fontSize: '0.9em', marginTop: '5px' }}>Nenhum curso encontrado para associar.</p>}
                </div>
                <button type="submit" className="btn btn-submit" disabled={loading || loadingCursos || cursos.length === 0}>
                    {loading ? 'Cadastrando...' : 'Cadastrar Matéria'}
                </button>
                <button type="button" className="btn btn-cancel" onClick={() => navigate('/materias')} disabled={loading}>
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default CadastrarMateria;