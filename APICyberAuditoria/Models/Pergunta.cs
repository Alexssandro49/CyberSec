using System.ComponentModel.DataAnnotations;

namespace APICyberAuditoria.Models
{
    public class Pergunta
    {
        [Key]
        public int Id { get; set; }
        public int ControleId { get; set; }
        public virtual Controle? Controle { get; set; }
        public string? Nome { get; set; }
        [Required]
        public string? Descricao { get; set; }
        public ICollection<Reposta>? Repostas { get; set; }
    }
}
