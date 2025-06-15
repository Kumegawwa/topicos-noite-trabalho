using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization; // Adicione esta linha se não estiver lá
using System.Collections.Generic; // Certifique-se que esta linha está presente
using Api.Models; // Adicione esta linha para resolver o erro 'Materia'

namespace Api.Models
{
    public class Curso
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "O nome do curso é obrigatório.")]
        [StringLength(100, ErrorMessage = "O nome não pode ter mais de 100 caracteres.")]
        public string Nome { get; set; } = string.Empty; // Inicializa para evitar warnings CS8618

        // Propriedade de navegação para as matérias associadas a este curso
        // [JsonIgnore] // Você pode precisar ignorar esta propriedade ao serializar Cursos para evitar ciclos,
                       // mas para a listagem talvez seja necessário. Se ainda der erro, podemos revisitá-la.
        public ICollection<Materia>? Materias { get; set; }
    }
}