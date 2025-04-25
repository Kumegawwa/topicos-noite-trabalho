using Microsoft.EntityFrameworkCore;
using Api.Models; // se os modelos estiverem em Api/Models

namespace Api.Data
{
    public class AppDataContext : DbContext
    {
        public AppDataContext(DbContextOptions<AppDataContext> options) : base(options) { }

        public DbSet<Aluno> Alunos { get; set; }
        public DbSet<Curso> Cursos { get; set; }
        public DbSet<Materia> Materias { get; set; }
    }
}
