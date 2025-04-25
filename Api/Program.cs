using Api.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Adicionar o AppDataContext ao DI
builder.Services.AddDbContext<AppDataContext>(options =>
    options.UseSqlite("Data Source=escola.db"));

var app = builder.Build();

app.MapGet("/", () => "API rodando");

app.Run();
