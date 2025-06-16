using Microsoft.EntityFrameworkCore;
using Api.Models; // Importa os modelos de dados (Aluno, Curso, Materia) definidos no namespace Api.Models.
                  // Isso permite que o DbContext os reconheça e crie tabelas correspondentes no banco de dados.

namespace Api.Data
{
    // AppDataContext herda de DbContext, que é a classe central do Entity Framework Core
    // para interagir com o banco de dados.
    public class AppDataContext : DbContext
    {
        // Construtor do AppDataContext. Ele recebe DbContextOptions<AppDataContext> como argumento,
        // o que permite configurar o provedor de banco de dados (neste caso, SQLite) e a string de conexão
        // através do arquivo appsettings.json, garantindo flexibilidade e separação de preocupações.
        public AppDataContext(DbContextOptions<AppDataContext> options) : base(options) { }

        // DbSet<Aluno> representa uma coleção de todas as entidades 'Aluno' no contexto,
        // que pode ser consultada e salva no banco de dados. Cada DbSet mapeia para uma tabela no DB.
        public DbSet<Aluno> Alunos { get; set; }

        // DbSet<Curso> representa a tabela de Cursos no banco de dados.
        public DbSet<Curso> Cursos { get; set; }

        // DbSet<Materia> representa a tabela de Materias no banco de dados.
        // O Entity Framework Core irá configurar automaticamente o relacionamento entre Materia e Curso
        // (chave estrangeira 'CursoId') com base nas definições nos modelos.
        public DbSet<Materia> Materias { get; set; }
    }
}