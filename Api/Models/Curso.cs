using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

public class Curso
{
    public int Id { get; set; }

    [Required(ErrorMessage = "O nome do curso é obrigatório.")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "O nome do curso deve ter entre 3 e 100 caracteres.")]
    public string Nome { get; set; }

    // A lista de matérias não precisa de validação direta aqui, mas a relação é importante
    public List<Materia>? Materias { get; set; } // Tornar a lista anulável ou inicializar vazia

    public Curso()
    {
        Materias = new List<Materia>(); // Inicializa a lista para evitar NullReferenceException
    }
}

