using APICyberAuditoria.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[AllowAnonymous]
[ApiController]
public class AuditoriasController : ControllerBase
{
    private readonly DBAuditoria _context;
    public AuditoriasController(DBAuditoria context)
    {
        _context = context;
    }

    // GET: api/Auditoria
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Auditoria>>> GetAuditoria()
    {
        return await _context.Auditorias.ToListAsync();
    }
    [HttpGet("Recentes")]
    public async Task<ActionResult> GetAuditoriasRecentes()
    {
        var auditoriasRecentes = await _context.Auditorias.Include(s=>s.Empresa)
            .OrderByDescending(a => a.Id)
            .Take(5)
            .ToListAsync();
        var resultados = auditoriasRecentes.Select(a => new
        {
            id=a.Id,
            empresa = a.Empresa.Nome ?? "Empresa não especificada",
            norma= _context.Auditorias.Where(s => s.Id == a.Id).SelectMany(s => s.Respostas).Select(s => s.Pergunta.Controle.Modulo.Nome).FirstOrDefault() ?? "Módulo não especificado",
            data = a.Data,
            score =""
            
        });

        return Ok(resultados);
    }
    [HttpGet("Empresa/{idEmpresa}/Modulo/{idModulo}")]
    public async Task<ActionResult> GetAuditoriasRecentes(int idEmpresa, int idModulo)
    {
        // 1. Fazemos TODOS os Includes necessários em uma única viagem ao banco de dados!
        var auditorias = await _context.Auditorias
            .Include(a => a.Respostas)
                .ThenInclude(r => r.Pergunta)
                    .ThenInclude(p => p.Controle)
                        .ThenInclude(c => c.Modulo)
            .Where(a => a.EmpresaId == idEmpresa && a.Respostas.Any(r => r.Pergunta.Controle.ModuloId == idModulo))
            .OrderByDescending(a => a.Data)
            .ToListAsync();

        // 2. Mapeamento e Cálculo do Score na memória (muito mais rápido)
        var resultados = auditorias.Select(a =>
        {
            // Pega apenas as respostas desta auditoria referentes ao módulo filtrado
            var respostasDoModulo = a.Respostas.Where(r => r.Pergunta.Controle.ModuloId == idModulo).ToList();

            // Conta quantos SIM e NÃO existem
            double totalSim = respostasDoModulo.Count(r => r.Resposta == TipoReposta.Sim);
            double totalNao = respostasDoModulo.Count(r => r.Resposta == TipoReposta.Não);

            double totalValidas = totalSim + totalNao;

            // Calcula a porcentagem. Se não houver nenhuma resposta válida (só N/A), a nota é 0.
            int scoreCalculado = totalValidas > 0
                                 ? (int)Math.Round((totalSim / totalValidas) * 100)
                                 : 0;

            // Descobre o nome do módulo com base na primeira pergunta
            string nomeModulo = respostasDoModulo.FirstOrDefault()?.Pergunta?.Controle?.Modulo?.Nome ?? "Módulo não especificado";

            return new
            {
                id = a.Id,
                modulo = nomeModulo, // Corrigido a grafia de 'modulu' para 'modulo'
                data = a.Data.ToString("dd/MM/yyyy"),
                score = scoreCalculado
            };
        });

        return Ok(resultados);
    }

    // GET: api/Auditoria/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Auditoria>> GetAuditoria(int id)
    {
        var auditoria = await _context.Auditorias.FindAsync(id);

        if (auditoria == null)
        {
            return NotFound();
        }

        return auditoria;
    }

    // PUT: api/Auditoria/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<IActionResult> PutAuditoria(int? id, Auditoria auditoria)
    {
        if (id != auditoria.Id)
        {
            return BadRequest();
        }

        _context.Entry(auditoria).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!AuditoriaExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    // POST: api/Auditoria
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    public async Task<ActionResult<Auditoria>> PostAuditoria(Auditoria auditoria)
    {
        auditoria.Data = DateTime.UtcNow;
        _context.Auditorias.Add(auditoria);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetAuditoria", new { id = auditoria.Id }, auditoria);
    }

    // DELETE: api/Auditoria/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAuditoria(int? id)
    {
        var auditoria = await _context.Auditorias.FindAsync(id);
        if (auditoria == null)
        {
            return NotFound();
        }

        _context.Auditorias.Remove(auditoria);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool AuditoriaExists(int? id)
    {
        return _context.Auditorias.Any(e => e.Id == id);
    }
}
