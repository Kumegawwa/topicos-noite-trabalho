import axios from 'axios';

// Define a URL base da sua API
// Certifique-se de que a porta corresponde à porta em que sua API .NET está rodando
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001'; // Use 5001 ou 7001 ou a porta configurada

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptadores (opcional)
apiClient.interceptors.request.use(config => {
  // console.log('Enviando requisição:', config);
  return config;
}, error => {
  // console.error('Erro na requisição:', error);
  return Promise.reject(error);
});

apiClient.interceptors.response.use(response => {
  // console.log('Recebendo resposta:', response);
  return response;
}, error => {
  // console.error('Erro na resposta:', error.response || error.message);
  return Promise.reject(error);
});

export default apiClient;