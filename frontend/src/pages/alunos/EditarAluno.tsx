import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../../services/api';
import { Aluno } from '../../models/Aluno';
import './Alunos.css'; // Reutiliza os estilos

const EditarAluno: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>(); // Obtém o ID da URL
    const [aluno, setAluno] = useState<Aluno | null>(null); // Inicializa como null até carregar
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            fetchAluno(parseInt(id, 10));
        } else {
            setError("ID do aluno não fornecido.");
            setLoading(false);
        }
    }, [id]);

    const fetchAluno = async (alunoId: number) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.get<Aluno>(`/alunos/${alunoId}`);
            response.data.dataNascimento = response.data.dataNascimento.split('T')[0];
            setAluno(response.data);
        } catch (err) {
            console.error("Erro ao buscar aluno:", err);
            setError('Não foi possível carregar os dados do aluno. Verifique o ID e tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (aluno) {
            setAluno(prevAluno => ({
                ...prevAluno!,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!aluno || !id) {
            setError("Dados do aluno não carregados ou ID inválido.");
            return;
        }

        setLoading(true);
        setError(null);

        if (!aluno.nome || !aluno.email || !aluno.dataNascimento || !aluno.matricula) {
            setError('Todos os campos são obrigatórios.');
            setLoading(false);
            return;
        }

        try {
            await apiClient.put(`/alunos/${id}`, aluno);
            alert('Aluno atualizado com sucesso!');
            navigate('/alunos'); // Redireciona para a lista após a edição
        } catch (err: any) {
            console.error("Erro ao atualizar aluno:", err);
             if (err.response && err.response.data && err.response.data.errors) {
                const validationErrors = Object.values(err.response.data.errors).flat().join(', ');
                setError(`Erro de validação: ${validationErrors}`);
            } else {
                setError('Erro ao atualizar aluno. Verifique os dados e tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Carregando dados do aluno...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!aluno) {
        return <div className="error-message">Aluno não encontrado.</div>;
    }

    return (
        <div className="alunos-container form-container">
            <h2>Editar Aluno</h2>
            <form onSubmit={handleSubmit}>
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
                <button type="submit" className="btn btn-submit" disabled={loading}>
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
                 <button type="button" className="btn btn-cancel" onClick={() => navigate('/alunos')} disabled={loading}>
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default EditarAluno;