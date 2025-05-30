import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/api';
import { Aluno } from '../../models/Aluno';
import './Alunos.css'; // Reutiliza os estilos

const CadastrarAluno: React.FC = () => {
    const navigate = useNavigate();
    const [aluno, setAluno] = useState<Aluno>({
        nome: '',
        email: '',
        dataNascimento: '', // Inicializa como string vazia
        matricula: ''
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAluno(prevAluno => ({
            ...prevAluno,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!aluno.nome || !aluno.email || !aluno.dataNascimento || !aluno.matricula) {
            setError('Todos os campos são obrigatórios.');
            setLoading(false);
            return;
        }

        try {
            await apiClient.post('/alunos', aluno);
            alert('Aluno cadastrado com sucesso!');
            navigate('/alunos'); // Redireciona para a lista após o cadastro
        } catch (err: any) {
            console.error("Erro ao cadastrar aluno:", err);
            if (err.response && err.response.data && err.response.data.errors) {
                const validationErrors = Object.values(err.response.data.errors).flat().join(', ');
                setError(`Erro de validação: ${validationErrors}`);
            } else {
                setError('Erro ao cadastrar aluno. Verifique os dados e tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="alunos-container form-container">
            <h2>Cadastrar Novo Aluno</h2>
            {error && <p className="error-message">{error}</p>}
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
                        type="text" // Pode ser 'number' dependendo da regra
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
                    {loading ? 'Cadastrando...' : 'Cadastrar Aluno'}
                </button>
                <button type="button" className="btn btn-cancel" onClick={() => navigate('/alunos')} disabled={loading}>
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default CadastrarAluno;