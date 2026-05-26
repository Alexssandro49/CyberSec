using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using APICyberAuditoria.Models;
using Microsoft.AspNetCore.Authorization;
using APICyberAuditoria.Data;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class RespostasController : ControllerBase
{
    private readonly DBAuditoria _context;
    public RespostasController(DBAuditoria context)
    {
        _context = context;
    }

    // GET: api/Reposta
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Reposta>>> GetReposta()
    {
        return await _context.Repostas.ToListAsync();
    }

    // GET: api/Reposta/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Reposta>> GetReposta(int id)
    {
        var reposta = await _context.Repostas.FindAsync(id);

        if (reposta == null)
        {
            return NotFound();
        }

        return reposta;
    }

    // PUT: api/Reposta/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<IActionResult> PutReposta(int? id, Reposta reposta)
    {
        if (id != reposta.Id)
        {
            return BadRequest();
        }

        _context.Entry(reposta).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!RepostaExists(id))
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

    // POST: api/Reposta
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    public async Task<ActionResult<Reposta>> PostReposta(Reposta reposta)
    {
        _context.Repostas.Add(reposta);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetReposta", new { id = reposta.Id }, reposta);
    }

    // DELETE: api/Reposta/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteReposta(int? id)
    {
        var reposta = await _context.Repostas.FindAsync(id);
        if (reposta == null)
        {
            return NotFound();
        }

        _context.Repostas.Remove(reposta);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool RepostaExists(int? id)
    {
        return _context.Repostas.Any(e => e.Id == id);
    }
}
