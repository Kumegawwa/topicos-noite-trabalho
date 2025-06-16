// Importa a interface `Materia` do mesmo diretório.
// Isso é necessário porque `Curso` tem uma relação com `Materia`.
import { Materia } from "./Materia";

// Interface para representar a estrutura de dados de um Curso.
// Esta interface espelha a classe `Curso` definida no backend (C#).
export interface Curso {
  // `id?`: Propriedade opcional. O ID é gerado pelo backend (banco de dados) ao criar um novo curso.
  // Ele é necessário ao listar, editar ou excluir um curso.
  id?: number;
  // `nome`: Nome do curso. É uma string e um campo obrigatório.
  // A validação de comprimento e obrigatoriedade deve ser feita tanto no frontend quanto no backend.
  nome: string;
  // `materias?`: Uma coleção opcional de objetos `Materia`.
  // Esta propriedade representa o relacionamento "um para muitos" (um curso tem muitas matérias).
  // É opcional porque nem sempre as matérias serão carregadas junto com o curso (por exemplo,
  // em uma listagem simples de cursos, pode não ser necessário carregar todas as matérias associadas para cada curso,
  // dependendo da eficiência da API ou da lógica de exibição).
  // No backend, essa propriedade é usada para navegação no Entity Framework Core.
  materias?: Materia[];
}