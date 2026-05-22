using Microsoft.EntityFrameworkCore;

namespace APICyberAuditoria.Models
{
    public class DBAuditoria : DbContext
    {
        public DbSet<APICyberAuditoria.Models.Empresa> Empresa { get; set; } = default!;
        public DbSet<APICyberAuditoria.Models.Usuario> Usuario { get; set; } = default!;
        public DBAuditoria(DbContextOptions<DBAuditoria> options) : base(options)
        {
        }
        public DbSet<Modulo> Modulos { get; set; }
        public DbSet<Controle> Controles { get; set; }
        public DbSet<Pergunta> Perguntas { get; set; }
        public DbSet<Auditoria> Auditorias { get; set; }
        public DbSet<Reposta> Repostas { get; set; }
        
    }
}
