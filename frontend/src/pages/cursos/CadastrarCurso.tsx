import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/api';
import { Curso } from '../../models/Curso';
import './Cursos.css'; // Reutiliza os estilos

const CadastrarCurso: React.FC = () => {
    const navigate = useNavigate();
    const [curso, setCurso] = useState<Curso>({
        nome: '',
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurso(prevCurso => ({
            ...prevCurso,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!curso.nome) {
            setError('O nome do curso é obrigatório.');
            setLoading(false);
            return;
        }

        try {
            await apiClient.post('/cursos', curso);
            alert('Curso cadastrado com sucesso!');
            navigate('/cursos'); // Redireciona para a lista
        } catch (err: any) {
            console.error("Erro ao cadastrar curso:", err);
            if (err.response && err.response.data && err.response.data.errors) {
                const validationErrors = Object.values(err.response.data.errors).flat().join(', ');
                setError(`Erro de validação: ${validationErrors}`);
            } else {
                setError('Erro ao cadastrar curso. Tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cursos-container form-container">
            <h2>Cadastrar Novo Curso</h2>
            {error && <p className="error-message">{error}</p>}
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
                    {loading ? 'Cadastrando...' : 'Cadastrar Curso'}
                </button>
                <button type="button" className="btn btn-cancel" onClick={() => navigate('/cursos')} disabled={loading}>
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default CadastrarCurso;