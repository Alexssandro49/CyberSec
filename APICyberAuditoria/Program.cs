using APICyberAuditoria.Data;
using APICyberAuditoria.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.Negotiate;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);
// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});
builder.Services.AddDbContext<DBAuditoria>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DbConect")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("PoliticaCyberAuditoria", policy =>
    {
        policy.AllowAnyOrigin()   // Permite que o seu React (localhost:5173) aceda
              .AllowAnyMethod()   // Permite GET, POST, PUT, DELETE, OPTIONS
              .AllowAnyHeader();  // MAGIA AQUI: Permite que o browser envie o 'Authorization: Bearer'
    });
});
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddAuthentication(NegotiateDefaults.AuthenticationScheme)
   .AddNegotiate();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])),
        ClockSkew = TimeSpan.FromSeconds(10) // Mantido os 10s de tolerância
    };

    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            // Tenta ler o token do cookie caso não esteja no header Authorization
            var accessToken = context.Request.Cookies["access_token"];
            if (!string.IsNullOrEmpty(accessToken))
            {
                context.Token = accessToken;
            }
            return Task.CompletedTask;
        }
    };
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}
app.UseCors("PoliticaCyberAuditoria");
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
await app.Services.SeedModulosIsosAsync();
using (var scope = app.Services.CreateScope())
{
    // Troque 'SeuDbContext' pelo nome real da sua classe de contexto do banco (ex: AppDbContext, CyberAuditoriaContext)
    var db = scope.ServiceProvider.GetRequiredService<DBAuditoria>();

    // Verifica se o usuário master já existe para não duplicar
    bool adminExiste = db.Usuario.Any(u => u.Email == "UsuarioMaster@Master.com");

    if (!adminExiste)
    {
        var usuarioMaster = new Usuario // Troque 'Usuario' se o nome da sua classe for diferente
        {
            Nome = "Admin",
            Email = "UsuarioMaster@Master.com",
            Senha = "ISO27001si"

            // Se você tiver um campo de Role/Perfil, adicione aqui, ex:
            // Perfil = "Administrador"
        };
        var hasher = new PasswordHasher<Usuario>();
        usuarioMaster.Senha = hasher.HashPassword(usuarioMaster, usuarioMaster.Senha);
        db.Usuario.Add(usuarioMaster);
        db.SaveChanges();

        Console.WriteLine("Usuário Master criado com sucesso!");
    }
}
app.Run();
