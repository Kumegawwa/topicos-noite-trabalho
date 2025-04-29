using Api.Data;
using Microsoft.EntityFrameworkCore;
using Api.Models; // Certifique-se que os modelos Aluno, Curso, Materia estão neste namespace ou adicione os usings necessários

var builder = WebApplication.CreateBuilder(args);

// Adicionar o AppDataContext ao DI
builder.Services.AddDbContext<AppDataContext>(options =>
    options.UseSqlite("Data Source=escola.db"));

// Adicionar suporte a CORS (necessário para o frontend acessar a API de outro domínio/porta)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000") // URL do seu frontend React
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// Habilitar CORS
app.UseCors("AllowReactApp");

// Endpoint raiz
app.MapGet("/", () => "API Gerenciador Escolar rodando");

// --- Endpoints para Alunos ---

// GET: Retorna todos os alunos
app.MapGet("/alunos", async (AppDataContext db) => 
    await db.Alunos.ToListAsync());

// POST: Cria um novo aluno
app.MapPost("/alunos", async (Aluno aluno, AppDataContext db) =>
{
    // Adicionar validação básica aqui ou usar bibliotecas como FluentValidation
    if (aluno == null || string.IsNullOrWhiteSpace(aluno.Nome))
    {
        return Results.BadRequest("Dados inválidos para aluno.");
    }
    db.Alunos.Add(aluno);
    await db.SaveChangesAsync();
    return Results.Created($"/alunos/{aluno.Id}", aluno);
});

// GET: Retorna um aluno específico pelo ID
app.MapGet("/alunos/{id}", async (int id, AppDataContext db) =>
{
    var aluno = await db.Alunos.FindAsync(id);
    return aluno is not null ? Results.Ok(aluno) : Results.NotFound();
});

// PUT: Atualiza um aluno existente
app.MapPut("/alunos/{id}", async (int id, Aluno alunoAtualizado, AppDataContext db) =>
{
    var aluno = await db.Alunos.FindAsync(id);
    if (aluno is null) return Results.NotFound();

    // Adicionar validação para alunoAtualizado
    if (alunoAtualizado == null || string.IsNullOrWhiteSpace(alunoAtualizado.Nome))
    {
        return Results.BadRequest("Dados inválidos para atualização do aluno.");
    }

    // Atualiza as propriedades do aluno existente com os dados recebidos
    aluno.Nome = alunoAtualizado.Nome;
    aluno.Email = alunoAtualizado.Email;
    aluno.DataNascimento = alunoAtualizado.DataNascimento;
    // Adicione outras propriedades se necessário

    await db.SaveChangesAsync();
    return Results.Ok(aluno); // Ou Results.NoContent();
});

// DELETE: Exclui um aluno
app.MapDelete("/alunos/{id}", async (int id, AppDataContext db) =>
{
    var aluno = await db.Alunos.FindAsync(id);
    if (aluno is null) return Results.NotFound();

    db.Alunos.Remove(aluno);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// --- Endpoints para Cursos ---

// GET: Retorna todos os cursos
app.MapGet("/cursos", async (AppDataContext db) => 
    await db.Cursos.Include(c => c.Materias).ToListAsync()); // Inclui matérias relacionadas

// POST: Cria um novo curso
app.MapPost("/cursos", async (Curso curso, AppDataContext db) =>
{
    if (curso == null || string.IsNullOrWhiteSpace(curso.Nome))
    {
        return Results.BadRequest("Dados inválidos para curso.");
    }
    db.Cursos.Add(curso);
    await db.SaveChangesAsync();
    return Results.Created($"/cursos/{curso.Id}", curso);
});

// GET: Retorna um curso específico pelo ID
app.MapGet("/cursos/{id}", async (int id, AppDataContext db) =>
{
    var curso = await db.Cursos.Include(c => c.Materias).FirstOrDefaultAsync(c => c.Id == id);
    return curso is not null ? Results.Ok(curso) : Results.NotFound();
});

// PUT: Atualiza um curso existente
app.MapPut("/cursos/{id}", async (int id, Curso cursoAtualizado, AppDataContext db) =>
{
    var curso = await db.Cursos.FindAsync(id);
    if (curso is null) return Results.NotFound();

    if (cursoAtualizado == null || string.IsNullOrWhiteSpace(cursoAtualizado.Nome))
    {
        return Results.BadRequest("Dados inválidos para atualização do curso.");
    }

    curso.Nome = cursoAtualizado.Nome;
    // A atualização de listas relacionadas (Materias) pode exigir lógica adicional
    // Por exemplo, limpar a lista existente e adicionar as novas matérias, ou comparar as listas.

    await db.SaveChangesAsync();
    return Results.Ok(curso);
});

// DELETE: Exclui um curso
app.MapDelete("/cursos/{id}", async (int id, AppDataContext db) =>
{
    var curso = await db.Cursos.Include(c => c.Materias).FirstOrDefaultAsync(c => c.Id == id);
    if (curso is null) return Results.NotFound();

    // Verifica se o curso tem matérias associadas antes de excluir
    if (curso.Materias != null && curso.Materias.Any())
    {
        return Results.BadRequest("Não é possível excluir o curso pois ele possui matérias associadas.");
        // Ou implemente a lógica de exclusão em cascata se desejado (configuração no DbContext)
    }

    db.Cursos.Remove(curso);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// --- Endpoints para Matérias ---

// GET: Retorna todas as matérias
app.MapGet("/materias", async (AppDataContext db) => 
    await db.Materias.Include(m => m.Curso).ToListAsync()); // Inclui o curso relacionado

// POST: Cria uma nova matéria
app.MapPost("/materias", async (Materia materia, AppDataContext db) =>
{
    if (materia == null || string.IsNullOrWhiteSpace(materia.Nome) || materia.CursoId <= 0)
    {
        return Results.BadRequest("Dados inválidos para matéria.");
    }
    // Verifica se o CursoId fornecido existe
    var cursoExiste = await db.Cursos.AnyAsync(c => c.Id == materia.CursoId);
    if (!cursoExiste)
    {
        return Results.BadRequest($"Curso com ID {materia.CursoId} não encontrado.");
    }

    db.Materias.Add(materia);
    await db.SaveChangesAsync();
    // Retorna a matéria criada, incluindo o curso associado para contexto
    var materiaCriada = await db.Materias.Include(m => m.Curso).FirstOrDefaultAsync(m => m.Id == materia.Id);
    return Results.Created($"/materias/{materia.Id}", materiaCriada);
});

// GET: Retorna uma matéria específica pelo ID
app.MapGet("/materias/{id}", async (int id, AppDataContext db) =>
{
    var materia = await db.Materias.Include(m => m.Curso).FirstOrDefaultAsync(m => m.Id == id);
    return materia is not null ? Results.Ok(materia) : Results.NotFound();
});

// PUT: Atualiza uma matéria existente
app.MapPut("/materias/{id}", async (int id, Materia materiaAtualizada, AppDataContext db) =>
{
    var materia = await db.Materias.FindAsync(id);
    if (materia is null) return Results.NotFound();

    if (materiaAtualizada == null || string.IsNullOrWhiteSpace(materiaAtualizada.Nome) || materiaAtualizada.CursoId <= 0)
    {
        return Results.BadRequest("Dados inválidos para atualização da matéria.");
    }
    // Verifica se o novo CursoId existe
    var cursoExiste = await db.Cursos.AnyAsync(c => c.Id == materiaAtualizada.CursoId);
    if (!cursoExiste)
    {
        return Results.BadRequest($"Curso com ID {materiaAtualizada.CursoId} não encontrado.");
    }

    materia.Nome = materiaAtualizada.Nome;
    materia.CursoId = materiaAtualizada.CursoId; // Permite mudar a matéria de curso

    await db.SaveChangesAsync();
    // Retorna a matéria atualizada, incluindo o curso associado
    var materiaRetorno = await db.Materias.Include(m => m.Curso).FirstOrDefaultAsync(m => m.Id == id);
    return Results.Ok(materiaRetorno);
});

// DELETE: Exclui uma matéria
app.MapDelete("/materias/{id}", async (int id, AppDataContext db) =>
{
    var materia = await db.Materias.FindAsync(id);
    if (materia is null) return Results.NotFound();

    db.Materias.Remove(materia);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// --- Execução da Aplicação ---
app.Run();

