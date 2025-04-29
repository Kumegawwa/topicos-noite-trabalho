using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Materia
{
    public int Id { get; set; }

    [Required(ErrorMessage = "O nome da matéria é obrigatório.")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "O nome da matéria deve ter entre 3 e 100 caracteres.")]
    public string Nome { get; set; }

    [Required(ErrorMessage = "É obrigatório associar a matéria a um curso.")]
    [Range(1, int.MaxValue, ErrorMessage = "O ID do curso associado é inválido.")]
    public int CursoId { get; set; }

    // Propriedade de navegação para o curso
    [ForeignKey("CursoId")]
    public Curso? Curso { get; set; } // Permite nulo ou carrega conforme necessário
}

