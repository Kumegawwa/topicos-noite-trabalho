// src/types/index.ts
export interface Aluno {
    id: number;       // Ou string, dependendo da sua API
    nome: string;
    email?: string;    // Marcar como opcional se não for sempre retornado
    matricula?: string; // Marcar como opcional se não for sempre retornado
    // Adicione outras propriedades que sua API retorna
  }