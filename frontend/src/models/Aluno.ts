// Interface para representar um Aluno
export interface Aluno {
  id?: number; // O ID é opcional ao criar, mas presente ao listar/editar
  nome: string;
  email: string;
  dataNascimento: string; // Usar string no formato YYYY-MM-DD para facilitar input type="date"
  matricula: string;
}