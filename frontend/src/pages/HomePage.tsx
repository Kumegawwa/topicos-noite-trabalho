import React from 'react'; // Importa a biblioteca React.

// Declaração de um componente funcional React chamado HomePage.
// Este componente representa a página inicial da aplicação.
const HomePage: React.FC = () => {
  return (
    // Renderiza um div com a classe CSS 'home-page' e um estilo inline para padding.
    // O estilo inline é simples para esta página, mas estilos mais complexos
    // seriam definidos em um arquivo CSS separado.
    <div className="home-page" style={{ padding: '20px' }}>
      {/* Título da página. */}
      <h2>Bem-vindo ao Gerenciador Escolar</h2>
      {/* Parágrafo de texto que orienta o usuário sobre a funcionalidade da aplicação. */}
      <p>
        Utilize a barra de navegação acima para gerenciar Alunos, Cursos e Matérias.
      </p>
    </div>
  );
};

export default HomePage; // Exporta o componente HomePage para ser utilizado nas rotas da aplicação.