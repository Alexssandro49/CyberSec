using System.ComponentModel.DataAnnotations;

namespace APICyberAuditoria.Models
{
    public class Controle
    {
        [Key]
        public int Id { get; set; }
        public int ModuloId { get; set; }
        public virtual Modulo? Modulo { get; set; }
        [Required]
        public string? Nome { get; set; }
        public ICollection<Pergunta>? Perguntas { get; set; }
    }
}
