import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../../services/api';
import { Materia } from '../../models/Materia';
import { Curso } from '../../models/Curso'; // Para listar cursos no select
import './Materias.css'; // Reutiliza os estilos

const EditarMateria: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [materia, setMateria] = useState<Materia | null>(null);
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingCursos, setLoadingCursos] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCursos(); // Busca cursos primeiro
    }, []);

    useEffect(() => {
        if (!loadingCursos && id) {
            fetchMateria(parseInt(id, 10));
        } else if (!id) {
            setError("ID da matéria não fornecido.");
            setLoading(false);
        }
    }, [id, loadingCursos]);

    const fetchCursos = async () => {
        setLoadingCursos(true);
        try {
            const response = await apiClient.get<Curso[]>('/cursos');
            setCursos(response.data);
        } catch (err) {
            console.error("Erro ao buscar cursos:", err);
            setError('Não foi possível carregar a lista de cursos para seleção.');
        } finally {
            setLoadingCursos(false);
        }
    };

    const fetchMateria = async (materiaId: number) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.get<Materia>(`/materias/${materiaId}`);
            setMateria(response.data);
        } catch (err) {
            console.error("Erro ao buscar matéria:", err);
            setError('Não foi possível carregar os dados da matéria.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (materia) {
            setMateria(prevMateria => ({
                ...prevMateria!,
                [name]: name === 'cursoId' ? parseInt(value, 10) : value
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!materia || !id) {
            setError("Dados da matéria não carregados ou ID inválido.");
            return;
        }

        setLoading(true);
        setError(null);

        if (!materia.nome || materia.cursoId <= 0) {
            setError('O nome da matéria e a seleção de um curso são obrigatórios.');
            setLoading(false);
            return;
        }

        try {
            await apiClient.put(`/materias/${id}`, { nome: materia.nome, cursoId: materia.cursoId });
            alert('Matéria atualizada com sucesso!');
            navigate('/materias'); // Redireciona para a lista
        } catch (err: any) {
            console.error("Erro ao atualizar matéria:", err);
            let errorMsg = 'Erro ao atualizar matéria. Verifique os dados e tente novamente.';
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

    if (loading || loadingCursos) {
        return <div className="loading">Carregando dados...</div>;
    }

    if (error && !materia) {
        return <div className="error-message">{error}</div>;
    }
    
    if (!materia) {
         return <div className="error-message">Matéria não encontrada.</div>;
    }

    return (
        <div className="materias-container form-container">
            <h2>Editar Matéria</h2>
            {error && materia && <p className="error-message">{error}</p>} 
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
                        disabled={cursos.length === 0}
                    >
                        <option value="0" disabled>Selecione um curso...</option>
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
                <button type="submit" className="btn btn-submit" disabled={loading}>
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
                <button type="button" className="btn btn-cancel" onClick={() => navigate('/materias')} disabled={loading}>
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default EditarMateria;