import React from 'react'; // Importa a biblioteca React.
import ReactDOM from 'react-dom/client'; // Importa as funcionalidades de renderização específicas do React para o DOM.
import './styles/global.css'; // Importa o arquivo CSS global para estilos que afetam toda a aplicação.
import App from './App'; // Importa o componente principal da aplicação, 'App'.
import reportWebVitals from './reportWebVitals'; // Importa a função para medição de web vitals (performance).

// Cria um "root" do React, que é o ponto de entrada para a renderização da aplicação.
// `document.getElementById('root')` seleciona o elemento HTML com o ID 'root',
// que é onde a aplicação React será montada.
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement // 'as HTMLElement' é uma asserção de tipo para TypeScript.
);

// Renderiza o componente 'App' dentro do `root` do React.
// React.StrictMode: Um componente que ajuda a identificar problemas potenciais na aplicação.
// Ele ativa verificações adicionais e avisos em modo de desenvolvimento, mas não renderiza nenhuma UI visível.
root.render(
  <React.StrictMode>
    <App /> {/* O componente principal da sua aplicação. */}
  </React.StrictMode>
);

// Chama a função reportWebVitals para medir e reportar métricas de performance da web.
// Isso é útil para entender como o desempenho da sua aplicação afeta a experiência do usuário.
reportWebVitals();