import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../services/api';
import { Curso } from '../../models/Curso';
import './Cursos.css'; // Estilos específicos

const ListarCursos: React.FC = () => {
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCursos();
    }, []);

    const fetchCursos = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.get<Curso[]>('/cursos');
            setCursos(response.data);
        } catch (err) {
            console.error("Erro ao buscar cursos:", err);
            setError('Não foi possível carregar a lista de cursos.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este curso? A exclusão só será permitida se não houver matérias associadas.')) {
            try {
                await apiClient.delete(`/cursos/${id}`);
                setCursos(cursos.filter(curso => curso.id !== id));
                alert('Curso excluído com sucesso!');
            } catch (err: any) {
                console.error("Erro ao excluir curso:", err);
                let errorMsg = 'Erro ao excluir curso.';
                if (err.response && err.response.data && typeof err.response.data === 'string') {
                    errorMsg = err.response.data;
                } else if (err.response && err.response.status === 400) {
                     errorMsg = 'Não é possível excluir o curso pois ele possui matérias associadas.';
                }
                setError(errorMsg);
                alert(errorMsg);
            }
        }
    };

    if (loading) {
        return <div className="loading">Carregando cursos...</div>;
    }

    return (
        <div className="cursos-container list-container">
            <h2>Lista de Cursos</h2>
            {error && <p className="error-message">{error}</p>}
            <Link to="/cursos/cadastrar" className="btn btn-primary mb-3">Cadastrar Novo Curso</Link>
            {cursos.length === 0 && !loading && <p>Nenhum curso cadastrado.</p>}
            {cursos.length > 0 && (
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Nº Matérias</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cursos.map((curso) => (
                            <tr key={curso.id}>
                                <td>{curso.id}</td>
                                <td>{curso.nome}</td>
                                <td>{curso.materias?.length ?? 0}</td>
                                <td>
                                    <Link to={`/cursos/editar/${curso.id}`} className="btn btn-sm btn-warning me-2">Editar</Link>
                                    <button 
                                        onClick={() => handleDelete(curso.id!)} 
                                        className="btn btn-sm btn-danger"
                                        disabled={!curso.id}
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

export default ListarCursos;