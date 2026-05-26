using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using APICyberAuditoria.Models;
using Microsoft.AspNetCore.Authorization;
using APICyberAuditoria.Data;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class ControlesController : ControllerBase
{
    private readonly DBAuditoria _context;
    public ControlesController(DBAuditoria context)
    {
        _context = context;
    }

    // GET: api/Controle
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Controle>>> GetControle()
    {
        return await _context.Controles.ToListAsync();
    }

    // GET: api/Controle/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Controle>> GetControle(int id)
    {
        var controle = await _context.Controles.FindAsync(id);

        if (controle == null)
        {
            return NotFound();
        }

        return controle;
    }
    [HttpGet("Auditoria/{id}")]
    public async Task<ActionResult<Controle>> GetControleAuditoria(int id)
    {
        var controles = await _context.Controles
            .Include(a => a.Perguntas)
                .ThenInclude(r => r.Repostas.Where(s => s.AuditoriaId == id))
            .Where(a => a.Perguntas.Any(r => r.Repostas.Any(rep => rep.AuditoriaId == id)))
            .ToListAsync();
        if (controles == null)
        {
            return NotFound();
        }
        // 2. Mapeamento e Cálculo do Score na memória (muito mais rápido)
        var resultados = controles.Select(a =>
        {
            // Pega apenas as respostas desta auditoria referentes ao módulo filtrado
            var respostasDoControle = a.Perguntas.SelectMany(p => p.Repostas).Where(s=>s.Resposta==TipoReposta.Sim || s.Resposta==TipoReposta.Não).ToList();

            // Conta quantos SIM e NÃO existem
            double totalSim = respostasDoControle.Count(r => r.Resposta == TipoReposta.Sim);
            double totalNao = respostasDoControle.Count(r => r.Resposta == TipoReposta.Não);

            double totalValidas = totalSim + totalNao;

            // Calcula a porcentagem. Se não houver nenhuma resposta válida (só N/A), a nota é 0.
            int scoreCalculado = totalValidas > 0
                                 ? (int)Math.Round((totalSim / totalValidas) * 100)
                                 : 0;

            return new
            {
                id = a.Id,
                nome = "Controle",
                categoria = a.Nome,
                desempenho = scoreCalculado,
                perguntas = a.Perguntas.Select(p => new 
                {
                    id = p.Id,
                    nome= p.Nome,
                    descricao= p.Descricao,
                    resposta = p.Repostas.Where(s=>s.PerguntaId == p.Id).Select(s=>s.Resposta).FirstOrDefault().ToString()
                }).ToList()
            };
        });
        return Ok(resultados);
    }
    // PUT: api/Controle/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<IActionResult> PutControle(int? id, Controle controle)
    {
        if (id != controle.Id)
        {
            return BadRequest();
        }

        _context.Entry(controle).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!ControleExists(id))
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

    // POST: api/Controle
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    public async Task<ActionResult<Controle>> PostControle(Controle controle)
    {
        _context.Controles.Add(controle);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetControle", new { id = controle.Id }, controle);
    }

    // DELETE: api/Controle/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteControle(int? id)
    {
        var controle = await _context.Controles.FindAsync(id);
        if (controle == null)
        {
            return NotFound();
        }

        _context.Controles.Remove(controle);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool ControleExists(int? id)
    {
        return _context.Controles.Any(e => e.Id == id);
    }
}
