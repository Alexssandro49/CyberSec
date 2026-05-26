using APICyberAuditoria.Data;
using APICyberAuditoria.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

[Route("api/[controller]")]
[ApiController]
public class UsuariosController : ControllerBase
{
    private readonly DBAuditoria _context;
    private readonly IConfiguration _config;
    public UsuariosController(DBAuditoria context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }
    public class LoginRequest
    {
        public string? Email { get; set; }
        public string? Senha { get; set; }
    }
    // GET: api/Usuario
    [HttpGet]
    [Authorize]
    public async Task<ActionResult<IEnumerable<Usuario>>> GetUsuario()
    {
        return await _context.Usuario.ToListAsync();
    }

    // GET: api/Usuario/5
    [HttpGet("{id}")]
    [Authorize]
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
    [Authorize]
    public async Task<IActionResult> PutUsuario(int? id, Usuario usuario)
    {
        if (id != usuario.Id)
        {
            return BadRequest();
        }
        var hasher = new PasswordHasher<Usuario>();
        usuario.Senha = hasher.HashPassword(usuario, usuario.Senha);
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
    [HttpPost("RefreshToken")]
    [AllowAnonymous]
    public IActionResult RefreshToken([FromBody] string tokenAntigo)
    {
        var handler = new JwtSecurityTokenHandler();
        // 3. Leia o token
        var jwtToken = handler.ReadJwtToken(tokenAntigo);

        var nameIdentifier =jwtToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(nameIdentifier))
        {
            return BadRequest("Token inválido");
        }
        var usuario = _context.Usuario.FirstOrDefault(u => u.Email == nameIdentifier);
        if (usuario == null)
        {
            return BadRequest("Usuário não encontrado");
        }
        var novoToken = GerarToken(usuario);
        var usuarioView = new
        {
            Id = usuario.Id,
            Nome = usuario.Nome,
            Email = usuario.Email,
            token = GerarToken(usuario)
        };
        return Ok(usuarioView);
    }

    // POST: api/Usuario
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    [Authorize]
    public async Task<ActionResult<Usuario>> PostUsuario(Usuario usuario)
    {
        if (usuario == null) { return BadRequest("Dados do usuário inválidos"); }
        if (usuario.Senha == null || usuario.Senha.Length < 6) { return BadRequest("Senha inválida"); }
        var hasher = new PasswordHasher<Usuario>();
        usuario.Senha = hasher.HashPassword(usuario, usuario.Senha);
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
        var hasher = new PasswordHasher<Usuario>();
        var resultado = hasher.VerifyHashedPassword(usuario, usuario.Senha, request.Senha);
        if (resultado != PasswordVerificationResult.Success)
        {
            return BadRequest("Senha invalida");
        }
        bool admin = usuario.Nome == "Admin" && usuario.Email == "UsuarioMaster";
        
        var usuarioView = new
        {
            Id = usuario.Id,
            Nome = usuario.Nome,
            Email = usuario.Email,
            token = GerarToken(usuario)
        };
        return Ok(usuarioView);
    }

    // DELETE: api/Usuario/5
    [HttpDelete("{id}")]
    [Authorize]
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
    private string GerarToken(Usuario usuario)
    {
        var jwtSettings = _config.GetSection("Jwt");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expirationMinutes = jwtSettings.GetValue<int>("AccessTokenExpirationMinutes");
        bool admin = usuario.Nome == "Admin" && usuario.Email == "UsuarioMaster@Master.com";
        var tipoPermissao = admin ? "Admin" : "User";
       
        var claims = new[]
        {
                new Claim(ClaimTypes.Name, usuario.Nome),
                new Claim(ClaimTypes.Role, tipoPermissao),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, usuario.Email)
            };

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expirationMinutes),
            signingCredentials: credentials
        );
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
