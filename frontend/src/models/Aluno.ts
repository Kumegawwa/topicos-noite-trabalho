// Interface para representar a estrutura de dados de um Aluno.
// Esta interface espelha a classe `Aluno` definida no backend (C#),
// garantindo consistência entre frontend e backend.
export interface Aluno {
  // `id?`: Propriedade opcional. Ao criar um novo aluno, o ID não será fornecido,
  // pois ele é gerado pelo banco de dados. Ao listar ou editar, o ID estará presente.
  id?: number;
  // `nome`: Nome completo do aluno. É uma string e é um campo obrigatório.
  nome: string;
  // `email`: Endereço de email do aluno. É uma string e é um campo obrigatório.
  // A validação de formato de e-mail deve ser feita tanto no frontend quanto no backend.
  email: string;
  // `dataNascimento`: Data de nascimento do aluno. Armazenada como string.
  // O formato 'YYYY-MM-DD' é comumente usado para input type="date" em HTML
  // e facilita a interoperabilidade com APIs que esperam ou retornam datas neste formato.
  dataNascimento: string;
  // `matricula`: Número de matrícula do aluno. É uma string e é um campo obrigatório.
  // No backend, pode haver validações adicionais (ex: apenas números, comprimento máximo).
  matricula: string;
}