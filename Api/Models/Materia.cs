using System.ComponentModel.DataAnnotations;

public class Materia
{
    public int Id { get; set; }
    public string Nome { get; set; }
    public int CursoId { get; set; }
    public Curso Curso { get; set; }
}
