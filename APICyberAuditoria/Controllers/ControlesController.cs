using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using APICyberAuditoria.Models;

[Route("api/[controller]")]
[ApiController]
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
