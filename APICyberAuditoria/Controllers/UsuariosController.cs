using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using APICyberAuditoria.Models;
using Microsoft.AspNetCore.Authorization;
using APICyberAuditoria.Data;

[Route("api/[controller]")]
[ApiController]
public class UsuariosController : ControllerBase
{
    private readonly DBAuditoria _context;
    public UsuariosController(DBAuditoria context)
    {
        _context = context;
    }
    public class LoginRequest
    {
        public string? Email { get; set; }
        public string? Senha { get; set; }
    }
    // GET: api/Usuario
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<Usuario>>> GetUsuario()
    {
        return await _context.Usuario.ToListAsync();
    }

    // GET: api/Usuario/5
    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<ActionResult<Usuario>> GetUsuario(int id)
    {
        var usuario = await _context.Usuario.FindAsync(id);

        if (usuario == null)
        {
            return NotFound();
        }

        return usuario;
    }

    // PUT: api/Usuario/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> PutUsuario(int? id, Usuario usuario)
    {
        if (id != usuario.Id)
        {
            return BadRequest();
        }

        _context.Entry(usuario).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!UsuarioExists(id))
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

    // POST: api/Usuario
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    [AllowAnonymous]
    public async Task<ActionResult<Usuario>> PostUsuario(Usuario usuario)
    {
        _context.Usuario.Add(usuario);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetUsuario", new { id = usuario.Id }, usuario);
    }
    [HttpPost("Login")]
    [AllowAnonymous]
    public async Task<ActionResult<Usuario>> PostLogin(LoginRequest request)
    {
        var usuario = await _context.Usuario.FirstOrDefaultAsync(u => u.Email == request.Email);

        if (usuario == null )
        {
            return NotFound("Usuário não encontrado");
        }
        if (usuario.Senha != request.Senha)
        {
            return BadRequest("Senha invalida");
        }
        var usuarioView = new
        {
            Id = usuario.Id,
            Nome = usuario.Nome,
            Email = usuario.Email
        };
        return Ok(usuarioView);
    }

    // DELETE: api/Usuario/5
    [HttpDelete("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> DeleteUsuario(int? id)
    {
        var usuario = await _context.Usuario.FindAsync(id);
        if (usuario == null)
        {
            return NotFound();
        }

        _context.Usuario.Remove(usuario);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool UsuarioExists(int? id)
    {
        return _context.Usuario.Any(e => e.Id == id);
    }
}
