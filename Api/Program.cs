using Api.Data;
using Microsoft.EntityFrameworkCore;
using Api.Models; // Certifique-se que os modelos Aluno, Curso, Materia estão neste namespace
using Microsoft.OpenApi.Models; // Necessário para Swagger
using System.Linq;
using System.Text.Json.Serialization; // Adicione este using para ReferenceHandler

var builder = WebApplication.CreateBuilder(args);

// --- Configuração dos Serviços ---

// Adicionar o AppDataContext ao DI
builder.Services.AddDbContext<AppDataContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"))); // Usar Connection String do appsettings

// Adicionar suporte a CORS
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

// Adicionar serviços do Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "API Gerenciador Escolar", Version = "v1" });
});

// Adicionar configuração para o System.Text.Json lidar com ciclos
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
});


// --- Construção da Aplicação ---
var app = builder.Build();

// --- Configuração do Pipeline HTTP ---

// Habilitar Swagger UI apenas em ambiente de desenvolvimento
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "API Gerenciador Escolar V1");
        c.RoutePrefix = string.Empty; // Acessar Swagger UI pela raiz da API (ex: https://localhost:7001/)
    });
}

// Habilitar CORS
app.UseCors("AllowReactApp");

// Redirecionamento HTTPS (opcional, mas recomendado)
app.UseHttpsRedirection();

// --- Endpoints da API ---

// Endpoint raiz (redireciona para Swagger UI em desenvolvimento)
app.MapGet("/", (HttpContext context) =>
{
    // Em desenvolvimento, redireciona para a UI do Swagger
    if (app.Environment.IsDevelopment())
    {
        context.Response.Redirect("/index.html", permanent: false);
        return Task.CompletedTask;
    }
    // Em produção, retorna uma mensagem simples
    return context.Response.WriteAsync("API Gerenciador Escolar rodando.");
})
.ExcludeFromDescription(); // Não mostrar este endpoint no Swagger

// --- Endpoints para Alunos ---

// GET: Retorna todos os alunos
app.MapGet("/alunos", async (AppDataContext db) =>
    await db.Alunos.ToListAsync())
    .WithTags("Alunos"); // Agrupa no Swagger

// POST: Cria um novo aluno
app.MapPost("/alunos", async (Aluno aluno, AppDataContext db) =>
{
    // Validação do modelo (DataAnnotations) é feita automaticamente pelo Minimal APIs
    // Você pode adicionar validações personalizadas se necessário
    db.Alunos.Add(aluno);
    await db.SaveChangesAsync();
    return Results.Created($"/alunos/{aluno.Id}", aluno);
})
.WithTags("Alunos");

// GET: Retorna um aluno específico pelo ID
app.MapGet("/alunos/{id}", async (int id, AppDataContext db) =>
{
    var aluno = await db.Alunos.FindAsync(id);
    return aluno is not null ? Results.Ok(aluno) : Results.NotFound();
})
.WithTags("Alunos");

// PUT: Atualiza um aluno existente
app.MapPut("/alunos/{id}", async (int id, Aluno alunoAtualizado, AppDataContext db) =>
{
    var aluno = await db.Alunos.FindAsync(id);
    if (aluno is null) return Results.NotFound();

    // Atualiza as propriedades do aluno existente com os dados recebidos
    // O mapeamento pode ser mais robusto usando bibliotecas como AutoMapper se a complexidade aumentar
    aluno.Nome = alunoAtualizado.Nome;
    aluno.Email = alunoAtualizado.Email;
    aluno.DataNascimento = alunoAtualizado.DataNascimento;
    aluno.Matricula = alunoAtualizado.Matricula; // Garante que a matrícula seja atualizada

    // Marca a entidade como modificada (opcional, mas pode ser útil em cenários complexos)
    // db.Entry(aluno).State = EntityState.Modified;

    await db.SaveChangesAsync();
    return Results.Ok(aluno); // Retorna o aluno atualizado
})
.WithTags("Alunos");

// DELETE: Exclui um aluno
app.MapDelete("/alunos/{id}", async (int id, AppDataContext db) =>
{
    var aluno = await db.Alunos.FindAsync(id);
    if (aluno is null) return Results.NotFound();

    db.Alunos.Remove(aluno);
    await db.SaveChangesAsync();
    return Results.NoContent();
})
.WithTags("Alunos");

// --- Endpoints para Cursos ---

// GET: Retorna todos os cursos com suas matérias
app.MapGet("/cursos", async (AppDataContext db) =>
    await db.Cursos.Include(c => c.Materias).ToListAsync())
    .WithTags("Cursos");

// POST: Cria um novo curso
app.MapPost("/cursos", async (Curso curso, AppDataContext db) =>
{
    db.Cursos.Add(curso);
    await db.SaveChangesAsync();
    return Results.Created($"/cursos/{curso.Id}", curso);
})
.WithTags("Cursos");

// GET: Retorna um curso específico pelo ID com suas matérias
app.MapGet("/cursos/{id}", async (int id, AppDataContext db) =>
{
    var curso = await db.Cursos.Include(c => c.Materias).FirstOrDefaultAsync(c => c.Id == id);
    return curso is not null ? Results.Ok(curso) : Results.NotFound();
})
.WithTags("Cursos");

// PUT: Atualiza um curso existente
app.MapPut("/cursos/{id}", async (int id, Curso cursoAtualizado, AppDataContext db) =>
{
    var curso = await db.Cursos.FindAsync(id);
    if (curso is null) return Results.NotFound();

    curso.Nome = cursoAtualizado.Nome;
    // Atualizar a lista de matérias associadas requer lógica adicional
    // (Ex: buscar o curso com Include(c => c.Materias), limpar a lista, adicionar as novas matérias do cursoAtualizado)
    // Por simplicidade, este endpoint atualiza apenas o nome.

    await db.SaveChangesAsync();
    return Results.Ok(curso);
})
.WithTags("Cursos");

// DELETE: Exclui um curso
app.MapDelete("/cursos/{id}", async (int id, AppDataContext db) =>
{
    var curso = await db.Cursos.Include(c => c.Materias).FirstOrDefaultAsync(c => c.Id == id);
    if (curso is null) return Results.NotFound();

    // Verifica se o curso tem matérias associadas antes de excluir
    if (curso.Materias != null && curso.Materias.Any())
    {
        // Retorna BadRequest informando que não pode excluir
        return Results.BadRequest("Não é possível excluir o curso pois ele possui matérias associadas.");
        // Alternativa: Implementar exclusão em cascata (config no DbContext) ou remover matérias manualmente.
    }

    db.Cursos.Remove(curso);
    await db.SaveChangesAsync();
    return Results.NoContent();
})
.WithTags("Cursos");

// --- Endpoints para Matérias ---

// GET: Retorna todas as matérias com seus cursos
app.MapGet("/materias", async (AppDataContext db) =>
    await db.Materias.Include(m => m.Curso).ToListAsync())
    .WithTags("Materias");

// POST: Cria uma nova matéria
app.MapPost("/materias", async (Materia materia, AppDataContext db) =>
{
    // Verifica se o CursoId fornecido existe
    var cursoExiste = await db.Cursos.AnyAsync(c => c.Id == materia.CursoId);
    if (!cursoExiste)
    {
        // Retorna BadRequest se o curso não for encontrado
        return Results.BadRequest($"Curso com ID {materia.CursoId} não encontrado.");
    }

    db.Materias.Add(materia);
    await db.SaveChangesAsync();

    // Retorna a matéria criada, incluindo o curso associado para contexto
    var materiaCriada = await db.Materias.Include(m => m.Curso).FirstOrDefaultAsync(m => m.Id == materia.Id);
    return Results.Created($"/materias/{materia.Id}", materiaCriada);
})
.WithTags("Materias");

// GET: Retorna uma matéria específica pelo ID com seu curso
app.MapGet("/materias/{id}", async (int id, AppDataContext db) =>
{
    var materia = await db.Materias.Include(m => m.Curso).FirstOrDefaultAsync(m => m.Id == id);
    return materia is not null ? Results.Ok(materia) : Results.NotFound();
})
.WithTags("Materias");

// PUT: Atualiza uma matéria existente
app.MapPut("/materias/{id}", async (int id, Materia materiaAtualizada, AppDataContext db) =>
{
    var materia = await db.Materias.FindAsync(id);
    if (materia is null) return Results.NotFound();

    // Verifica se o novo CursoId existe, se foi alterado
    if (materia.CursoId != materiaAtualizada.CursoId)
    {
        var cursoExiste = await db.Cursos.AnyAsync(c => c.Id == materiaAtualizada.CursoId);
        if (!cursoExiste)
        {
            return Results.BadRequest($"Curso com ID {materiaAtualizada.CursoId} não encontrado.");
        }
        materia.CursoId = materiaAtualizada.CursoId; // Permite mudar a matéria de curso
    }

    materia.Nome = materiaAtualizada.Nome;

    await db.SaveChangesAsync();

    // Retorna a matéria atualizada, incluindo o curso associado
    var materiaRetorno = await db.Materias.Include(m => m.Curso).FirstOrDefaultAsync(m => m.Id == id);
    return Results.Ok(materiaRetorno);
})
.WithTags("Materias");

// DELETE: Exclui uma matéria
app.MapDelete("/materias/{id}", async (int id, AppDataContext db) =>
{
    var materia = await db.Materias.FindAsync(id);
    if (materia is null) return Results.NotFound();

    db.Materias.Remove(materia);
    await db.SaveChangesAsync();
    return Results.NoContent();
})
.WithTags("Materias");

// --- Configuração Adicional e Execução ---

// Adicionar configuração para ler ConnectionString do appsettings.json
// Crie ou edite o arquivo appsettings.json e appsettings.Development.json na pasta Api
/* Exemplo appsettings.json:
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=escola.db"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
*/

// Execução da Aplicação
app.Run();