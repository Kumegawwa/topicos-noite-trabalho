using Api.Data;
using Microsoft.EntityFrameworkCore;
using Api.Models;

var builder = WebApplication.CreateBuilder(args);

// Adicionar o AppDataContext ao DI
builder.Services.AddDbContext<AppDataContext>(options =>
    options.UseSqlite("Data Source=escola.db"));

var app = builder.Build();

app.MapGet("/", () => "API rodando");

app.Run();

app.MapGet("/alunos", async (AppDataContext db) => await db.Alunos.ToListAsync());
app.MapPost("/alunos", async (Aluno aluno, AppDataContext db) =>
{
    db.Alunos.Add(aluno);
    await db.SaveChangesAsync();
    return Results.Created($"/alunos/{aluno.Id}", aluno);
});

// GET: Retorna todos os cursos
app.MapGet("/cursos", async (AppDataContext db) => 
    await db.Cursos.ToListAsync()); // Assume que você tem um DbSet<Curso> chamado Cursos no seu AppDataContext

// POST: Cria um novo curso
app.MapPost("/cursos", async (Curso curso, AppDataContext db) => // Assume que você tem uma classe de modelo chamada Curso
{
    db.Cursos.Add(curso);
    await db.SaveChangesAsync();

    // Retorna o status 201 Created com a localização do novo recurso e o objeto criado
    return Results.Created($"/cursos/{curso.Id}", curso); // Assume que a classe Curso tem uma propriedade Id
});

// GET: Retorna todas as matérias
app.MapGet("/materias", async (AppDataContext db) => 
    await db.Materias.ToListAsync()); // Assume que você tem um DbSet<Materia> chamado Materias no seu AppDataContext

// POST: Cria uma nova matéria
app.MapPost("/materias", async (Materia materia, AppDataContext db) => // Assume que você tem uma classe de modelo chamada Materia
{
    db.Materias.Add(materia);
    await db.SaveChangesAsync();

    // Retorna o status 201 Created com a localização do novo recurso e o objeto criado
    return Results.Created($"/materias/{materia.Id}", materia); // Assume que a classe Materia tem uma propriedade Id
});