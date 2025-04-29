// src/types/index.ts

// Define a interface para o objeto Aluno, espelhando o modelo C#
export interface Aluno {
  id: number; // Geralmente o ID é numérico
  nome: string;
  email: string;
  dataNascimento: string; // A API pode retornar como string ISO 8601. Ajustar se necessário.
  matricula: string; // Adicionado campo Matrícula
}

// Você pode adicionar outras interfaces aqui se necessário
// export interface Curso {
//   id: number;
//   nome: string;
//   materias?: Materia[]; // Lista opcional de matérias
// }

// export interface Materia {
//   id: number;
//   nome: string;
//   cursoId: number;
//   curso?: Curso; // Curso opcional
// }

