import { Materia } from "./Materia"; // Importa a interface Materia se necessário

// Interface para representar um Curso
export interface Curso {
  id?: number; // O ID é opcional ao criar
  nome: string;
  materias?: Materia[]; // Lista de matérias associadas (opcional, pode vir da API)
}