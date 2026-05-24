using APICyberAuditoria.Data;
using APICyberAuditoria.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
[AllowAnonymous]
public class EmpresasController : ControllerBase
{
    private readonly DBAuditoria _context;
    public EmpresasController(DBAuditoria context)
    {
        _context = context;
    }

    // GET: api/Empresa
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Empresa>>> GetEmpresa()
    {
        return await _context.Empresa.ToListAsync();
    }

    // GET: api/Empresa/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Empresa>> GetEmpresa(int id)
    {
        var empresa = await _context.Empresa.FindAsync(id);

        if (empresa == null)
        {
            return NotFound();
        }

        return empresa;
    }

    // PUT: api/Empresa/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<IActionResult> PutEmpresa(int? id, Empresa empresa)
    {
        if (id != empresa.Id)
        {
            return BadRequest();
        }

        _context.Entry(empresa).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!EmpresaExists(id))
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

    // POST: api/Empresa
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    public async Task<ActionResult<Empresa>> PostEmpresa(Empresa empresa)
    {
        _context.Empresa.Add(empresa);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetEmpresa", new { id = empresa.Id }, empresa);
    }

    // DELETE: api/Empresa/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEmpresa(int? id)
    {
        var empresa = await _context.Empresa.FindAsync(id);
        if (empresa == null)
        {
            return NotFound();
        }

        _context.Empresa.Remove(empresa);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool EmpresaExists(int? id)
    {
        return _context.Empresa.Any(e => e.Id == id);
    }
}
