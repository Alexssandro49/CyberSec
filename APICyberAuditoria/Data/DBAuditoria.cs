using APICyberAuditoria.Models;
using Microsoft.EntityFrameworkCore;

namespace APICyberAuditoria.Data
{
    public class DBAuditoria : DbContext
    {
        
        public DBAuditoria(DbContextOptions<DBAuditoria> options) : base(options)
        {
        }
        public DbSet<Empresa> Empresa { get; set; }
        public DbSet<Usuario> Usuario { get; set; }
        public DbSet<Modulo> Modulos { get; set; }
        public DbSet<Controle> Controles { get; set; }
        public DbSet<Pergunta> Perguntas { get; set; }
        public DbSet<Auditoria> Auditorias { get; set; }
        public DbSet<Reposta> Repostas { get; set; }
        
    }
}
