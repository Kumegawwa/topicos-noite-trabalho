import { Curso } from "./Curso"; // Importa a interface Curso, necessária para definir a relação.

// Interface para representar a estrutura de dados de uma Matéria.
// Esta interface espelha a classe `Materia` definida no backend (C#).
export interface Materia {
  // `id?`: Propriedade opcional. O ID é gerado pelo backend (banco de dados) ao criar uma nova matéria.
  // Ele é necessário ao listar, editar ou excluir uma matéria.
  id?: number;
  // `nome`: Nome da matéria. É uma string e um campo obrigatório.
  // Validações de comprimento e obrigatoriedade devem ser aplicadas.
  nome: string;
  // `cursoId`: O ID do curso ao qual esta matéria pertence.
  // Este é o campo de chave estrangeira que estabelece o vínculo entre Matéria e Curso no banco de dados.
  // É um campo obrigatório para associar a matéria a um curso existente.
  cursoId: number;
  // `curso?`: Objeto `Curso` associado. Esta é uma propriedade de navegação.
  // É opcional (`?`) porque o objeto `Curso` completo pode não ser sempre carregado junto com a matéria
  // (por exemplo, se a API não usar eager loading ou para evitar ciclos de referência na serialização JSON,
  // como é o caso no backend com `[JsonIgnore]`).
  // Quando presente, permite acessar detalhes do curso diretamente (ex: `materia.curso.nome`).
  curso?: Curso;
}