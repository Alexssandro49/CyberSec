using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using APICyberAuditoria.Models;

[Route("api/[controller]")]
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
            Id=a.Id,
            Data = a.Data,
            Empresa = a.Empresa.Name ?? "Empresa não especificada",
            Modulo= _context.Auditorias.Where(s => s.Id == a.Id).SelectMany(s => s.Perguntas).Select(s => s.Controle.Modulo.Nome).FirstOrDefault() ?? "Módulo não especificado",
            Score =""
            
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
