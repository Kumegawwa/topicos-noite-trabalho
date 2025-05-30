import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../../services/api';
import { Curso } from '../../models/Curso';
import './Cursos.css'; // Reutiliza os estilos

const EditarCurso: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [curso, setCurso] = useState<Curso | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            fetchCurso(parseInt(id, 10));
        } else {
            setError("ID do curso não fornecido.");
            setLoading(false);
        }
    }, [id]);

    const fetchCurso = async (cursoId: number) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.get<Curso>(`/cursos/${cursoId}`);
            setCurso(response.data);
        } catch (err) {
            console.error("Erro ao buscar curso:", err);
            setError('Não foi possível carregar os dados do curso.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (curso) {
            setCurso(prevCurso => ({
                ...prevCurso!,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!curso || !id) {
            setError("Dados do curso não carregados ou ID inválido.");
            return;
        }

        setLoading(true);
        setError(null);

        if (!curso.nome) {
            setError('O nome do curso é obrigatório.');
            setLoading(false);
            return;
        }

        try {
            await apiClient.put(`/cursos/${id}`, { nome: curso.nome }); 
            alert('Curso atualizado com sucesso!');
            navigate('/cursos'); // Redireciona para a lista
        } catch (err: any) {
            console.error("Erro ao atualizar curso:", err);
            if (err.response && err.response.data && err.response.data.errors) {
                const validationErrors = Object.values(err.response.data.errors).flat().join(', ');
                setError(`Erro de validação: ${validationErrors}`);
            } else {
                setError('Erro ao atualizar curso. Tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Carregando dados do curso...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!curso) {
        return <div className="error-message">Curso não encontrado.</div>;
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
                        value={curso.nome}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-submit" disabled={loading}>
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
                <button type="button" className="btn btn-cancel" onClick={() => navigate('/cursos')} disabled={loading}>
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default EditarCurso;