using System.ComponentModel.DataAnnotations;

namespace APICyberAuditoria.Models
{
    public class Empresa
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string? Name { get; set; }
        [Required]
        public string? CNPJ { get; set; }
        public ICollection<Auditoria>? Auditorias { get; set; }
    }
}
