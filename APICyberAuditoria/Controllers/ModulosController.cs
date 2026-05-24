using APICyberAuditoria.Data;
using APICyberAuditoria.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
[AllowAnonymous]
public class ModulosController : ControllerBase
{
    private readonly DBAuditoria _context;
    public ModulosController(DBAuditoria context)
    {
        _context = context;
    }

    // GET: api/Modulo
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Modulo>>> GetModulo()
    {
        return await _context.Modulos.ToListAsync();
    }

    // GET: api/Modulo/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Modulo>> GetModulo(int id)
    {
        var modulo = await _context.Modulos.FindAsync(id);

        if (modulo == null)
        {
            return NotFound();
        }

        return modulo;
    }

    [HttpGet("Empresa/{id}")]
    public async Task<ActionResult<Modulo>> GetEmpresaModulo(int id)
    {
        var modulosVinculados = await _context.Repostas
        .Where(r => r.Auditoria.EmpresaId == id)
        .Select(r => r.Pergunta.Controle.Modulo)
        .Distinct() // Evita duplicar o mesmo módulo na lista
        .ToListAsync();

        if (modulosVinculados == null || !modulosVinculados.Any())
        {
            // Se a empresa for nova e não tiver auditorias, você pode retornar vazio ou um NotFound
            return Ok(new List<Modulo>());
        }

        return Ok(modulosVinculados);
    }

    // PUT: api/Modulo/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<IActionResult> PutModulo(int? id, Modulo modulo)
    {
        if (id != modulo.Id)
        {
            return BadRequest();
        }

        _context.Entry(modulo).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!ModuloExists(id))
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

    // POST: api/Modulo
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    public async Task<ActionResult<Modulo>> PostModulo(Modulo modulo)
    {
        _context.Modulos.Add(modulo);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetModulo", new { id = modulo.Id }, modulo);
    }

    // DELETE: api/Modulo/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteModulo(int? id)
    {
        var modulo = await _context.Modulos.FindAsync(id);
        if (modulo == null)
        {
            return NotFound();
        }

        _context.Modulos.Remove(modulo);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool ModuloExists(int? id)
    {
        return _context.Modulos.Any(e => e.Id == id);
    }
}
