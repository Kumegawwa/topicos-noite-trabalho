// Este arquivo `index.ts` dentro da pasta `types` é usado para centralizar
// as definições de interfaces e tipos de dados que são compartilhados
// entre diferentes partes do frontend da aplicação.
// Isso promove a reutilização de código e garante a consistência de tipos.

// Define a interface para o objeto Aluno.
// Ela espelha a estrutura da entidade `Aluno` no backend C#,
// garantindo que os dados recebidos da API e enviados para ela
// estejam de acordo com o esperado.
export interface Aluno {
  // `id`: Identificador único do aluno.
  // No frontend, geralmente é tratado como `number`.
  // No C# (.NET), o `int` é mapeado para `number` em TypeScript.
  id: number;
  // `nome`: Nome completo do aluno.
  // No frontend, é uma `string`.
  nome: string;
  // `email`: Endereço de e-mail do aluno.
  // No frontend, é uma `string`.
  email: string;
  // `dataNascimento`: Data de nascimento do aluno.
  // A API .NET frequentemente retorna `DateTime` como uma string ISO 8601 (ex: "2025-06-15T23:36:56.000Z").
  // No frontend, é mais prático tratá-la como `string` para inputs `type="date"` ou para formatação.
  dataNascimento: string;
  // `matricula`: Número de matrícula do aluno.
  // Embora possa parecer numérico, muitas vezes é tratado como `string` para permitir zeros à esquerda
  // ou caracteres não numéricos se a regra de negócio mudar no futuro.
  matricula: string;
}

// Define a interface para o objeto Curso.
// Espelha a entidade `Curso` do backend.
export interface Curso {
   // `id`: Identificador único do curso.
   id: number;
   // `nome`: Nome do curso.
   nome: string;
   // `materias?`: Uma lista opcional de matérias associadas a este curso.
   // O `?` indica que a propriedade é opcional, pois em algumas requisições da API,
   // o campo `Materias` pode não ser incluído (ex: se não houver `.Include()` no EF Core,
   // ou se a serialização for configurada para ignorar propriedades de navegação para evitar ciclos).
   // O tipo `Materia[]` indica que é um array de objetos que seguem a interface `Materia`.
   materias?: Materia[];
}

// Define a interface para o objeto Materia.
// Espelha a entidade `Materia` do backend.
export interface Materia {
   // `id`: Identificador único da matéria.
   id: number;
   // `nome`: Nome da matéria.
   nome: string;
   // `cursoId`: O ID do curso ao qual esta matéria pertence.
   // Este é o campo de chave estrangeira que conecta `Materia` a `Curso`.
   cursoId: number;
   // `curso?`: Objeto `Curso` opcional.
   // Similar a `materias?` em `Curso`, esta propriedade de navegação pode não ser sempre incluída
   // nos dados recebidos da API (especialmente se `[JsonIgnore]` for usado no backend para Materia.Curso).
   // Quando presente, permite acessar detalhes do curso associado.
   curso?: Curso;
}