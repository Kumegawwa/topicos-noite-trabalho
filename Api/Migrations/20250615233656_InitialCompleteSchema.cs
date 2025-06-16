using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    // A classe da migração herda de Migration e contém os passos para aplicar e reverter as mudanças no esquema do banco de dados.
    public partial class InitialCompleteSchema : Migration
    {
        /// <inheritdoc />
        // O método 'Up' define as operações a serem executadas quando a migração é aplicada (por exemplo, ao rodar `dotnet ef database update`).
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Cria a tabela 'Alunos'.
            migrationBuilder.CreateTable(
                name: "Alunos", // Nome da tabela no banco de dados.
                columns: table => new
                {
                    // Definição da coluna 'Id':
                    // Tipo INTEGER, não nulo, chave primária, com auto incremento no SQLite.
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    // Definição da coluna 'Nome':
                    // Tipo TEXT, não nulo, com comprimento máximo de 100 caracteres.
                    Nome = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    // Definição da coluna 'Email':
                    // Tipo TEXT, não nulo, com comprimento máximo de 100 caracteres.
                    Email = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    // Definição da coluna 'DataNascimento':
                    // Tipo TEXT (para armazenar DateTime), não nulo.
                    DataNascimento = table.Column<DateTime>(type: "TEXT", nullable: false),
                    // Definição da coluna 'Matricula':
                    // Tipo TEXT, não nulo, com comprimento máximo de 20 caracteres.
                    Matricula = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    // Define a chave primária para a tabela 'Alunos' na coluna 'Id'.
                    table.PrimaryKey("PK_Alunos", x => x.Id);
                });

            // Cria a tabela 'Cursos'.
            migrationBuilder.CreateTable(
                name: "Cursos", // Nome da tabela.
                columns: table => new
                {
                    // Definição da coluna 'Id':
                    // Tipo INTEGER, não nulo, chave primária, com auto incremento.
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    // Definição da coluna 'Nome':
                    // Tipo TEXT, não nulo, com comprimento máximo de 100 caracteres.
                    Nome = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    // Define a chave primária para a tabela 'Cursos' na coluna 'Id'.
                    table.PrimaryKey("PK_Cursos", x => x.Id);
                });

            // Cria a tabela 'Materias'.
            migrationBuilder.CreateTable(
                name: "Materias", // Nome da tabela.
                columns: table => new
                {
                    // Definição da coluna 'Id':
                    // Tipo INTEGER, não nulo, chave primária, com auto incremento.
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    // Definição da coluna 'Nome':
                    // Tipo TEXT, não nulo, com comprimento máximo de 100 caracteres.
                    Nome = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    // Definição da coluna 'CursoId':
                    // Tipo INTEGER, não nulo. Esta é a chave estrangeira que liga a Matéria a um Curso.
                    CursoId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    // Define a chave primária para a tabela 'Materias' na coluna 'Id'.
                    table.PrimaryKey("PK_Materias", x => x.Id);
                    // Define a chave estrangeira 'FK_Materias_Cursos_CursoId',
                    // ligando 'CursoId' da tabela 'Materias' à coluna 'Id' da tabela 'Cursos'.
                    // onDelete: ReferentialAction.Cascade significa que, se um Curso for excluído,
                    // todas as Materias associadas a ele também serão excluídas automaticamente.
                    table.ForeignKey(
                        name: "FK_Materias_Cursos_CursoId",
                        column: x => x.CursoId,
                        principalTable: "Cursos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            // Cria um índice na coluna 'CursoId' da tabela 'Materias'.
            // Isso melhora a performance de consultas que filtram ou unem com base nesta coluna
            // e também ajuda a impor a restrição de chave estrangeira.
            migrationBuilder.CreateIndex(
                name: "IX_Materias_CursoId",
                table: "Materias",
                column: "CursoId");
        }

        /// <inheritdoc />
        // O método 'Down' define as operações para reverter as mudanças feitas pelo método 'Up'.
        // Isso é útil quando se precisa desfazer uma migração (por exemplo, ao rodar `dotnet ef database update 0`).
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Remove a tabela 'Alunos'.
            migrationBuilder.DropTable(
                name: "Alunos");

            // Remove a tabela 'Materias'.
            migrationBuilder.DropTable(
                name: "Materias");

            // Remove a tabela 'Cursos'. A ordem de remoção é importante devido às dependências de chave estrangeira.
            // As tabelas dependentes (Materias) devem ser removidas antes das tabelas que elas referenciam (Cursos).
            migrationBuilder.DropTable(
                name: "Cursos");
        }
    }
}