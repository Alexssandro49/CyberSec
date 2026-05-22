using System.ComponentModel.DataAnnotations;

namespace APICyberAuditoria.Models
{
    public class Modulo
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string? Nome { get; set; }
        public ICollection<Controle>? Controles { get; set; }
    }
}
