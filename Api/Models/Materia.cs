using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization; // Adicione este using

namespace Api.Models
{
    public class Materia
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "O nome da matéria é obrigatório.")]
        [StringLength(100, ErrorMessage = "O nome não pode ter mais de 100 caracteres.")]
        public string Nome { get; set; } = string.Empty; // Inicializa para evitar warnings CS8618

        // Chave estrangeira para Curso
        [ForeignKey("Curso")]
        public int CursoId { get; set; }

        // Propriedade de navegação para o Curso
        [JsonIgnore] // Adicione esta linha para ignorar a serialização desta propriedade
        public Curso? Curso { get; set; }
    }
}