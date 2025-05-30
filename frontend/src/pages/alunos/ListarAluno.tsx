import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../services/api';
import { Aluno } from '../../models/Aluno';
import './Alunos.css'; // Estilos específicos das páginas de Alunos

const ListarAlunos: React.FC = () => {
    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchAlunos();
    }, []);

    const fetchAlunos = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.get<Aluno[]>('/alunos');
            setAlunos(response.data);
        } catch (err) {
            console.error("Erro ao buscar alunos:", err);
            setError('Não foi possível carregar a lista de alunos. Tente novamente mais tarde.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este aluno?')) {
            try {
                await apiClient.delete(`/alunos/${id}`);
                setAlunos(alunos.filter(aluno => aluno.id !== id));
                alert('Aluno excluído com sucesso!');
            } catch (err) {
                console.error("Erro ao excluir aluno:", err);
                setError('Erro ao excluir aluno. Verifique se ele não possui dependências.');
                alert('Erro ao excluir aluno.');
            }
        }
    };

    if (loading) {
        return <div className="loading">Carregando alunos...</div>;
    }

    return (
        <div className="alunos-container list-container">
            <h2>Lista de Alunos</h2>
            {error && <p className="error-message">{error}</p>}
            <Link to="/alunos/cadastrar" className="btn btn-primary mb-3">Cadastrar Novo Aluno</Link>
            {alunos.length === 0 && !loading && <p>Nenhum aluno cadastrado.</p>}
            {alunos.length > 0 && (
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Matrícula</th>
                            <th>Data de Nascimento</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alunos.map((aluno) => (
                            <tr key={aluno.id}>
                                <td>{aluno.id}</td>
                                <td>{aluno.nome}</td>
                                <td>{aluno.email}</td>
                                <td>{aluno.matricula}</td>
                                <td>{new Date(aluno.dataNascimento).toLocaleDateString()}</td>
                                <td>
                                    <Link to={`/alunos/editar/${aluno.id}`} className="btn btn-sm btn-warning me-2">Editar</Link>
                                    <button 
                                        onClick={() => handleDelete(aluno.id!)} 
                                        className="btn btn-sm btn-danger"
                                        disabled={!aluno.id} // Desabilita se ID não estiver presente
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

export default ListarAlunos;