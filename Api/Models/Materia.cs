using System.ComponentModel.DataAnnotations; // Necessário para usar Data Annotations para validação e mapeamento.
using System.ComponentModel.DataAnnotations.Schema; // Necessário para a anotação [ForeignKey].
using System.Text.Json.Serialization; // Necessário para a anotação [JsonIgnore].

namespace Api.Models
{
    // A classe Materia representa a entidade Matéria no sistema e será mapeada para uma tabela no banco de dados.
    public class Materia
    {
        [Key] // Data Annotation que define 'Id' como a chave primária da tabela.
        public int Id { get; set; }

        [Required(ErrorMessage = "O nome da matéria é obrigatório.")] // Garante que o nome da matéria seja fornecido.
        [StringLength(100, ErrorMessage = "O nome não pode ter mais de 100 caracteres.")] // Define o comprimento máximo permitido para o nome.
        public string Nome { get; set; } = string.Empty; // Nome da matéria. Inicializado para evitar warnings de nulidade.

        // Chave estrangeira para a entidade Curso.
        // Esta propriedade armazena o Id do Curso ao qual esta matéria pertence, estabelecendo o relacionamento.
        [ForeignKey("Curso")] // Indica que 'CursoId' é uma chave estrangeira que referencia a entidade 'Curso'.
        public int CursoId { get; set; }

        // Propriedade de navegação para a entidade Curso.
        // Esta propriedade permite que você acesse o objeto Curso completo a partir de uma Materia.
        // Por exemplo, `materia.Curso.Nome` para obter o nome do curso.
        [JsonIgnore] // Esta anotação é crucial aqui. Ela impede que a propriedade 'Curso' seja serializada
                     // quando um objeto Materia é retornado pela API. Isso resolve o problema de ciclos de referência
                     // infinitos (Materia -> Curso -> Materias -> Curso...).
                     // A propriedade 'CursoId' ainda será serializada, permitindo que o frontend saiba a qual curso a matéria pertence.
        public Curso? Curso { get; set; } // O objeto Curso associado. É anulável pois pode não ser carregado em todas as consultas (lazy loading).
    }
}