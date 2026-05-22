using System.ComponentModel.DataAnnotations;

namespace APICyberAuditoria.Models
{
    public enum TipoReposta
    {
        Sim,
        Não,
        NaoSeAplica,
        EmAndamento
    }
    public class Reposta
    {
        [Key]
        public int Id { get; set; }
        public int PerguntaId { get; set; }
        public virtual Pergunta? Pergunta { get; set; }
        public int AuditoriaId { get; set; }
        public virtual Auditoria? Auditoria { get; set; }
        public TipoReposta Resposta { get; set; }
    }
}
