using APICyberAuditoria.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace APICyberAuditoria.Data
{
    public static class DataSeeder
    {
        public static async Task SeedModulosIsosAsync(this IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();

            // ATENÇÃO: Substitua 'ApplicationDbContext' pelo nome real do seu contexto
            var context = scope.ServiceProvider.GetRequiredService<DBAuditoria>();

            // Garante que a base de dados e as tabelas existem
            await context.Database.EnsureCreatedAsync();

            // Verifica se a base de dados já tem os módulos inseridos para evitar duplicações
            if (await context.Modulos.AnyAsync())
            {
                return; // A carga inicial já foi feita anteriormente
            }

            // O caminho onde o ficheiro JSON deve estar
            var jsonPath = Path.Combine(Directory.GetCurrentDirectory(), "CargaInicialISO.json");

            if (!File.Exists(jsonPath))
            {
                Console.WriteLine("O ficheiro CargaInicialISO.json não foi encontrado na raiz do projeto!");
                return;
            }

            var jsonString = await File.ReadAllTextAsync(jsonPath);

            // Deserializa o JSON diretamente para as suas classes
            var modulos = JsonSerializer.Deserialize<List<Modulo>>(jsonString, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true // Ignora diferenças entre maiúsculas/minúsculas
            });

            if (modulos != null && modulos.Any())
            {
                // Adiciona tudo de uma vez. O Entity Framework é inteligente o suficiente 
                // para criar as chaves estrangeiras (ControleId, ModuloId) automaticamente!
                await context.Modulos.AddRangeAsync(modulos);
                await context.SaveChangesAsync();

                Console.WriteLine("Carga inicial das ISOs (27001 e 27701) realizada com sucesso!");
            }
        }
    }
}
