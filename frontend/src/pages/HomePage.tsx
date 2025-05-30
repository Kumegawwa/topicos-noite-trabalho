import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="home-page" style={{ padding: '20px' }}>
      <h2>Bem-vindo ao Gerenciador Escolar</h2>
      <p>
        Utilize a barra de navegação acima para gerenciar Alunos, Cursos e Matérias.
      </p>
    </div>
  );
};

export default HomePage;