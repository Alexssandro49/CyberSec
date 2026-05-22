using System.ComponentModel.DataAnnotations;

namespace APICyberAuditoria.Models
{
    public class Auditoria
    {
        [Key]
        public int Id { get; set; }
        public DateTime Data { get; set; }
        public int UsuarioId { get; set; }
        public virtual Usuario? Usuario { get; set; }
        public int EmpresaId { get; set; }
        public virtual Empresa? Empresa { get; set; }
        public virtual ICollection<Pergunta>? Perguntas { get; set; } ;
    }
}
