import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../services/api';
import { Materia } from '../../models/Materia';
import './Materias.css'; // Estilos específicos

const ListarMaterias: React.FC = () => {
    const [materias, setMaterias] = useState<Materia[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchMaterias();
    }, []);

    const fetchMaterias = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.get<Materia[]>('/materias');
            setMaterias(response.data);
        } catch (err) {
            console.error("Erro ao buscar matérias:", err);
            setError('Não foi possível carregar a lista de matérias.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir esta matéria?')) {
            try {
                await apiClient.delete(`/materias/${id}`);
                setMaterias(materias.filter(materia => materia.id !== id));
                alert('Matéria excluída com sucesso!');
            } catch (err) {
                console.error("Erro ao excluir matéria:", err);
                setError('Erro ao excluir matéria.');
                alert('Erro ao excluir matéria.');
            }
        }
    };

    if (loading) {
        return <div className="loading">Carregando matérias...</div>;
    }

    return (
        <div className="materias-container list-container">
            <h2>Lista de Matérias</h2>
            {error && <p className="error-message">{error}</p>}
            <Link to="/materias/cadastrar" className="btn btn-primary mb-3">Cadastrar Nova Matéria</Link>
            {materias.length === 0 && !loading && <p>Nenhuma matéria cadastrada.</p>}
            {materias.length > 0 && (
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Curso Associado</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {materias.map((materia) => (
                            <tr key={materia.id}>
                                <td>{materia.id}</td>
                                <td>{materia.nome}</td>
                                <td>{materia.curso ? materia.curso.nome : `ID: ${materia.cursoId}`}</td>
                                <td>
                                    <Link to={`/materias/editar/${materia.id}`} className="btn btn-sm btn-warning me-2">Editar</Link>
                                    <button 
                                        onClick={() => handleDelete(materia.id!)} 
                                        className="btn btn-sm btn-danger"
                                        disabled={!materia.id}
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

export default ListarMaterias;