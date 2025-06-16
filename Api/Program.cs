using Api.Data; // Importa o namespace para o contexto do banco de dados (AppDataContext).
using Microsoft.EntityFrameworkCore; // Necessário para o Entity Framework Core, especialmente para AddDbContext e UseSqlite.
using Api.Models; // Importa os modelos de dados (Aluno, Curso, Materia) para que os endpoints possam usá-los.
using Microsoft.OpenApi.Models; // Necessário para a configuração do Swagger/OpenAPI.
using System.Linq; // Necessário para métodos LINQ como .Any() e .ToList().
using System.Text.Json.Serialization; // Necessário para ReferenceHandler.Preserve, que ajuda a lidar com ciclos de referência na serialização JSON.

var builder = WebApplication.CreateBuilder(args); // Cria um construtor de aplicação web.

// --- Configuração dos Serviços ---

// Configura o AppDataContext para ser injetado como um serviço.
// options.UseSqlite: Configura o Entity Framework Core para usar SQLite como provedor de banco de dados.
// builder.Configuration.GetConnectionString("DefaultConnection"): Obtém a string de conexão definida no arquivo appsettings.json.
// Isso permite uma fácil configuração e mudança de banco de dados sem alterar o código.
builder.Services.AddDbContext<AppDataContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Adiciona suporte a Cross-Origin Resource Sharing (CORS).
// Essencial para permitir que o frontend (geralmente em uma porta diferente) se comunique com a API.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", // Define uma política CORS chamada "AllowReactApp".
        policy =>
        {
            policy.WithOrigins("http://localhost:3000") // Permite requisições SOMENTE do frontend React rodando em http://localhost:3000.
                                                      // Em produção, esta URL deve ser a URL de deployment do frontend.
                  .AllowAnyHeader() // Permite qualquer cabeçalho na requisição.
                  .AllowAnyMethod(); // Permite qualquer método HTTP (GET, POST, PUT, DELETE).
        });
});

// Adiciona serviços do Swagger/OpenAPI para documentação automática da API.
// OpenApiExplorer: Ajuda a descobrir os endpoints da API.
// SwaggerGen: Gera a especificação OpenAPI (anteriormente Swagger JSON) para a API.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "API Gerenciador Escolar", Version = "v1" }); // Define informações básicas da API no Swagger UI.
});

// Adiciona suporte a controladores MVC (para Minimal APIs, mesmo que não sejam controladores tradicionais).
// AddJsonOptions: Configura as opções de serialização JSON.
// ReferenceHandler.Preserve: Importante para lidar com ciclos de referência em objetos relacionados
// (ex: Curso tem Materias, e Materia tem um Curso). Esta configuração instrui o serializador a preservar
// referências de objetos, evitando loops infinitos e erros de serialização.
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
});


// --- Construção da Aplicação ---
var app = builder.Build(); // Constrói a instância da aplicação web.

// --- Configuração do Pipeline HTTP ---

// Habilita o Swagger UI (interface de documentação interativa) apenas em ambiente de desenvolvimento.
// Isso evita que a documentação da API seja exposta em ambientes de produção.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger(); // Habilita o middleware para servir o JSON de especificação do Swagger.
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "API Gerenciador Escolar V1"); // Define o endpoint para o arquivo JSON do Swagger.
        c.RoutePrefix = string.Empty; // Configura o Swagger UI para ser acessível na raiz da API (ex: https://localhost:7001/).
    });
}

// Habilita a política CORS definida anteriormente.
// Deve ser chamado antes de app.UseAuthorization() e app.UseRouting() para que as políticas sejam aplicadas corretamente.
app.UseCors("AllowReactApp");

// Redirecionamento HTTPS: Garante que todas as requisições HTTP sejam redirecionadas para HTTPS.
// Recomendado para segurança, especialmente em produção.
app.UseHttpsRedirection();

// --- Endpoints da API ---
// Os endpoints são definidos usando as Minimal APIs do .NET, que permitem criar APIs RESTful
// com menos boilerplate de código em comparação com controladores MVC tradicionais.

// Endpoint raiz: Redireciona para o Swagger UI em desenvolvimento, ou mostra uma mensagem simples em produção.
app.MapGet("/", (HttpContext context) =>
{
    if (app.Environment.IsDevelopment())
    {
        context.Response.Redirect("/index.html", permanent: false); // Redireciona para o Swagger UI.
        return Task.CompletedTask;
    }
    return context.Response.WriteAsync("API Gerenciador Escolar rodando."); // Mensagem para produção.
})
.ExcludeFromDescription(); // Exclui este endpoint da documentação do Swagger, pois é apenas para redirecionamento.

// --- Endpoints para Alunos ---

// GET /alunos: Retorna todos os alunos do banco de dados.
// await db.Alunos.ToListAsync(): Assincronamente busca todos os alunos da tabela 'Alunos'.
// .WithTags("Alunos"): Agrupa este endpoint sob a tag "Alunos" na documentação do Swagger.
app.MapGet("/alunos", async (AppDataContext db) =>
    await db.Alunos.ToListAsync())
    .WithTags("Alunos");

// POST /alunos: Cria um novo aluno.
// O objeto 'aluno' é automaticamente desserializado do corpo da requisição JSON.
// db.Alunos.Add(aluno): Adiciona o novo aluno ao contexto do Entity Framework.
// await db.SaveChangesAsync(): Salva as mudanças (insere o aluno) no banco de dados.
// Results.Created(...): Retorna um status 201 Created com a URL do novo recurso e o objeto aluno criado.
app.MapPost("/alunos", async (Aluno aluno, AppDataContext db) =>
{
    // As validações de modelo (DataAnnotations como [Required], [StringLength], [EmailAddress])
    // são automaticamente aplicadas pelo ASP.NET Core Minimal APIs.
    // Erros de validação serão retornados com status 400 Bad Request.
    db.Alunos.Add(aluno);
    await db.SaveChangesAsync();
    return Results.Created($"/alunos/{aluno.Id}", aluno);
})
.WithTags("Alunos");

// GET /alunos/{id}: Retorna um aluno específico pelo seu ID.
// db.Alunos.FindAsync(id): Busca um aluno pelo ID da chave primária.
// Results.Ok(aluno): Se encontrado, retorna o aluno com status 200 OK.
// Results.NotFound(): Se não encontrado, retorna status 404 Not Found.
app.MapGet("/alunos/{id}", async (int id, AppDataContext db) =>
{
    var aluno = await db.Alunos.FindAsync(id);
    return aluno is not null ? Results.Ok(aluno) : Results.NotFound();
})
.WithTags("Alunos");

// PUT /alunos/{id}: Atualiza um aluno existente.
// O 'id' da URL é usado para encontrar o aluno, e 'alunoAtualizado' contém os novos dados.
// As propriedades do aluno existente são atualizadas com os dados da requisição.
// await db.SaveChangesAsync(): Persiste as alterações no banco de dados.
app.MapPut("/alunos/{id}", async (int id, Aluno alunoAtualizado, AppDataContext db) =>
{
    var aluno = await db.Alunos.FindAsync(id);
    if (aluno is null) return Results.NotFound(); // Retorna 404 se o aluno não for encontrado.

    // Atualiza as propriedades do aluno com os novos valores.
    // É importante atualizar individualmente para garantir que apenas os campos desejados sejam alterados.
    aluno.Nome = alunoAtualizado.Nome;
    aluno.Email = alunoAtualizado.Email;
    aluno.DataNascimento = alunoAtualizado.DataNascimento;
    aluno.Matricula = alunoAtualizado.Matricula; // Garante que a matrícula seja atualizada.

    await db.SaveChangesAsync();
    return Results.Ok(aluno); // Retorna o aluno atualizado com status 200 OK.
})
.WithTags("Alunos");

// DELETE /alunos/{id}: Exclui um aluno pelo ID.
// db.Alunos.Remove(aluno): Remove o aluno do contexto.
// await db.SaveChangesAsync(): Persiste a exclusão no banco de dados.
// Results.NoContent(): Retorna status 204 No Content após a exclusão bem-sucedida.
app.MapDelete("/alunos/{id}", async (int id, AppDataContext db) =>
{
    var aluno = await db.Alunos.FindAsync(id);
    if (aluno is null) return Results.NotFound(); // Retorna 404 se o aluno não for encontrado.

    db.Alunos.Remove(aluno);
    await db.SaveChangesAsync();
    return Results.NoContent();
})
.WithTags("Alunos");

// --- Endpoints para Cursos ---

// GET /cursos: Retorna todos os cursos, incluindo suas matérias associadas (eager loading).
// .Include(c => c.Materias): Garante que a coleção 'Materias' de cada Curso seja carregada junto.
app.MapGet("/cursos", async (AppDataContext db) =>
    await db.Cursos.Include(c => c.Materias).ToListAsync())
    .WithTags("Cursos");

// POST /cursos: Cria um novo curso.
app.MapPost("/cursos", async (Curso curso, AppDataContext db) =>
{
    db.Cursos.Add(curso);
    await db.SaveChangesAsync();
    return Results.Created($"/cursos/{curso.Id}", curso);
})
.WithTags("Cursos");

// GET /cursos/{id}: Retorna um curso específico pelo ID, incluindo suas matérias.
// .FirstOrDefaultAsync(c => c.Id == id): Usado para buscar um único curso e garantir que suas matérias sejam incluídas.
app.MapGet("/cursos/{id}", async (int id, AppDataContext db) =>
{
    var curso = await db.Cursos.Include(c => c.Materias).FirstOrDefaultAsync(c => c.Id == id);
    return curso is not null ? Results.Ok(curso) : Results.NotFound();
})
.WithTags("Cursos");

// PUT /cursos/{id}: Atualiza um curso existente (apenas o nome, para simplicidade).
app.MapPut("/cursos/{id}", async (int id, Curso cursoAtualizado, AppDataContext db) =>
{
    var curso = await db.Cursos.FindAsync(id);
    if (curso is null) return Results.NotFound();

    curso.Nome = cursoAtualizado.Nome; // Atualiza o nome do curso.
    // Lógica para atualizar matérias associadas seria mais complexa e exigiria remoção/adição de Materias.

    await db.SaveChangesAsync();
    return Results.Ok(curso);
})
.WithTags("Cursos");

// DELETE /cursos/{id}: Exclui um curso pelo ID.
// .Include(c => c.Materias).FirstOrDefaultAsync(...): Carrega o curso com suas matérias para verificar dependências.
// Validação de regra de negócio: Impede a exclusão se houver matérias associadas.
// Retorna 400 Bad Request se o curso tiver matérias, aplicando uma regra de negócio de exclusão.
app.MapDelete("/cursos/{id}", async (int id, AppDataContext db) =>
{
    var curso = await db.Cursos.Include(c => c.Materias).FirstOrDefaultAsync(c => c.Id == id);
    if (curso is null) return Results.NotFound();

    // Regra de negócio: Se o curso tem matérias, não permite a exclusão direta.
    if (curso.Materias != null && curso.Materias.Any())
    {
        return Results.BadRequest("Não é possível excluir o curso pois ele possui matérias associadas.");
    }

    db.Cursos.Remove(curso);
    await db.SaveChangesAsync();
    return Results.NoContent();
})
.WithTags("Cursos");

// --- Endpoints para Matérias ---

// GET /materias: Retorna todas as matérias, incluindo seus cursos associados.
app.MapGet("/materias", async (AppDataContext db) =>
    await db.Materias.Include(m => m.Curso).ToListAsync())
    .WithTags("Materias");

// POST /materias: Cria uma nova matéria.
// Valida se o CursoId fornecido existe no banco de dados antes de criar a matéria.
app.MapPost("/materias", async (Materia materia, AppDataContext db) =>
{
    var cursoExiste = await db.Cursos.AnyAsync(c => c.Id == materia.CursoId);
    if (!cursoExiste)
    {
        return Results.BadRequest($"Curso com ID {materia.CursoId} não encontrado.");
    }

    db.Materias.Add(materia);
    await db.SaveChangesAsync();

    // Após salvar, busca a matéria novamente com o curso incluído para retornar um objeto completo.
    var materiaCriada = await db.Materias.Include(m => m.Curso).FirstOrDefaultAsync(m => m.Id == materia.Id);
    return Results.Created($"/materias/{materia.Id}", materiaCriada);
})
.WithTags("Materias");

// GET /materias/{id}: Retorna uma matéria específica pelo ID, incluindo seu curso.
app.MapGet("/materias/{id}", async (int id, AppDataContext db) =>
{
    var materia = await db.Materias.Include(m => m.Curso).FirstOrDefaultAsync(m => m.Id == id);
    return materia is not null ? Results.Ok(materia) : Results.NotFound();
})
.WithTags("Materias");

// PUT /materias/{id}: Atualiza uma matéria existente.
// Permite a atualização do nome da matéria e a mudança de seu curso associado.
app.MapPut("/materias/{id}", async (int id, Materia materiaAtualizada, AppDataContext db) =>
{
    var materia = await db.Materias.FindAsync(id);
    if (materia is null) return Results.NotFound();

    // Verifica se o novo CursoId existe, caso tenha sido alterado na requisição.
    if (materia.CursoId != materiaAtualizada.CursoId)
    {
        var cursoExiste = await db.Cursos.AnyAsync(c => c.Id == materiaAtualizada.CursoId);
        if (!cursoExiste)
        {
            return Results.BadRequest($"Curso com ID {materiaAtualizada.CursoId} não encontrado.");
        }
        materia.CursoId = materiaAtualizada.CursoId; // Atualiza o CursoId.
    }

    materia.Nome = materiaAtualizada.Nome; // Atualiza o nome da matéria.

    await db.SaveChangesAsync();

    // Retorna a matéria atualizada, incluindo o curso associado para refletir a mudança.
    var materiaRetorno = await db.Materias.Include(m => m.Curso).FirstOrDefaultAsync(m => m.Id == id);
    return Results.Ok(materiaRetorno);
})
.WithTags("Materias");

// DELETE /materias/{id}: Exclui uma matéria pelo ID.
app.MapDelete("/materias/{id}", async (int id, AppDataContext db) =>
{
    var materia = await db.Materias.FindAsync(id);
    if (materia is null) return Results.NotFound();

    db.Materias.Remove(materia);
    await db.SaveChangesAsync();
    return Results.NoContent();
})
.WithTags("Materias");

// --- Execução da Aplicação ---
app.Run(); // Inicia a aplicação ASP.NET Core.