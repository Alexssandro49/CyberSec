using APICyberAuditoria.Data;
using APICyberAuditoria.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
[Authorize]
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
    [HttpGet("Modulo/{idModolu}")]
    public async Task<ActionResult<IEnumerable<Pergunta>>> GetPerguntaByAuditoria(int idModolu)
    {
        var perguntas = await _context.Perguntas.Where(p => p.Controle.ModuloId == idModolu).Include(p => p.Controle).ToListAsync();
        Modulo modulo = await _context.Modulos.FindAsync(idModolu);
        if (perguntas == null || perguntas.Count == 0 || modulo == null)
        {
            return NotFound();
        }
        var perguntasDto = perguntas.Select(p => new
        {
            id = p.Id,
            nome=p.Nome,
            descricao = p.Descricao,
            controle = new
            {
                nome = modulo.Nome ?? "Sem módulo",
                controle = p.Controle.Nome ?? "Sem controle"
            }
        });

        return Ok(perguntasDto);
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
