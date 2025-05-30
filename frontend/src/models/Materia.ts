import { Curso } from "./Curso"; // Importa a interface Curso se necessário

// Interface para representar uma Matéria
export interface Materia {
  id?: number; // O ID é opcional ao criar
  nome: string;
  cursoId: number; // ID do curso ao qual a matéria pertence
  curso?: Curso; // Objeto Curso associado (opcional, pode vir da API)
}