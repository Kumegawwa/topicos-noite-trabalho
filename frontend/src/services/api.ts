import axios from 'axios'; // Importa a biblioteca Axios para fazer requisições HTTP.

// Define a URL base da sua API.
// `process.env.REACT_APP_API_URL` permite que a URL da API seja configurada via variáveis de ambiente.
// Isso é crucial para ambientes de produção, onde a URL pode ser diferente de `localhost`.
// Se a variável de ambiente não estiver definida, ele usa 'http://localhost:5145' como fallback,
// que é a porta padrão para o backend .NET na configuração do launchSettings.json.
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5145';

// Cria uma instância do Axios configurada com a URL base e cabeçalhos padrão.
const apiClient = axios.create({
  baseURL: API_BASE_URL, // Define a URL base para todas as requisições desta instância.
  headers: {
    'Content-Type': 'application/json', // Define o cabeçalho Content-Type padrão para JSON.
  },
});

// --- Interceptadores (Opcional, mas útil para depuração e manipulação global de requisições/respostas) ---

// Interceptador de requisições:
// Esta função é executada antes que cada requisição HTTP seja enviada.
// Pode ser usada para:
// - Adicionar tokens de autenticação (JWT, por exemplo).
// - Logar informações da requisição para depuração.
// - Modificar cabeçalhos ou dados da requisição.
apiClient.interceptors.request.use(config => {
  // console.log('Enviando requisição:', config); // Descomente para logar cada requisição enviada.
  return config; // Retorna a configuração da requisição modificada ou original.
}, error => {
  // console.error('Erro na requisição:', error); // Loga erros que ocorrem antes da requisição ser enviada.
  return Promise.reject(error); // Propaga o erro.
});

// Interceptador de respostas:
// Esta função é executada para cada resposta recebida da API.
// Pode ser usada para:
// - Logar informações da resposta para depuração.
// - Tratar erros globais (ex: 401 Unauthorized, 500 Internal Server Error).
// - Transformar os dados da resposta.
apiClient.interceptors.response.use(response => {
  // console.log('Recebendo resposta:', response); // Descomente para logar cada resposta recebida.
  return response; // Retorna a resposta.
}, error => {
  // console.error('Erro na resposta:', error.response || error.message); // Loga detalhes do erro da resposta.
  // `error.response` contém a resposta do servidor (com status, data, headers) para erros HTTP.
  // `error.message` é a mensagem de erro do Axios (ex: Network Error).
  return Promise.reject(error); // Propaga o erro para ser tratado no componente que fez a requisição.
});

export default apiClient; // Exporta a instância configurada do Axios para ser utilizada nos serviços e componentes da aplicação.