using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using APICyberAuditoria.Models;

[Route("api/[controller]")]
[ApiController]
public class PerguntasController : ControllerBase
{
    private readonly DBAuditoria _context;
    public PerguntasController(DBAuditoria context)
    {
        _context = context;
    }

    // GET: api/Pergunta
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Pergunta>>> GetPergunta()
    {
        return await _context.Perguntas.ToListAsync();
    }

    // GET: api/Pergunta/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Pergunta>> GetPergunta(int id)
    {
        var pergunta = await _context.Perguntas.FindAsync(id);

        if (pergunta == null)
        {
            return NotFound();
        }

        return pergunta;
    }

    // PUT: api/Pergunta/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<IActionResult> PutPergunta(int? id, Pergunta pergunta)
    {
        if (id != pergunta.Id)
        {
            return BadRequest();
        }

        _context.Entry(pergunta).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!PerguntaExists(id))
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

    // POST: api/Pergunta
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    public async Task<ActionResult<Pergunta>> PostPergunta(Pergunta pergunta)
    {
        _context.Perguntas.Add(pergunta);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetPergunta", new { id = pergunta.Id }, pergunta);
    }

    // DELETE: api/Pergunta/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePergunta(int? id)
    {
        var pergunta = await _context.Perguntas.FindAsync(id);
        if (pergunta == null)
        {
            return NotFound();
        }

        _context.Perguntas.Remove(pergunta);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool PerguntaExists(int? id)
    {
        return _context.Perguntas.Any(e => e.Id == id);
    }
}
