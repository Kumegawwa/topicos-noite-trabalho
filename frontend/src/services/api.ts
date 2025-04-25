// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7123', // Ou a URL correta da sua API
});

export default api; // <--- Certifique-se que está usando 'export default'