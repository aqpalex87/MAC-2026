using MAC.Business.Logic.Layer.Interfaces;
using MAC.DTO.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace MAC.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : CustomControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public IActionResult Login([FromBody] AuthLoginRequestDto request)
        {
            var result = _authService.Login(request);
            if (result.Errors.Any())
            {
                return GetObjectResult(result);
            }

            Response.Headers.Add("Access-Control-Expose-Headers", "Authorization");
            Response.Headers.Add("Authorization", result.Resultado.Token);
            return Ok(result.Resultado);
        }

        [Authorize]
        [HttpGet("menus")]
        public IActionResult Menus()
        {
            var result = _authService.ObtenerMenusPorUsuario(UserJwt.CodUsuario, UserJwt.IdEmpresa, UserJwt.IdSede);
            if (result.Errors.Any())
            {
                return GetObjectResult(result);
            }

            return Ok(result.Resultado);
        }

        [AllowAnonymous]
        [HttpGet("empresas")]
        public IActionResult Empresas()
        {
            var result = _authService.ObtenerEmpresas();
            if (result.Errors.Any())
            {
                return GetObjectResult(result);
            }

            return Ok(result.Resultado);
        }

        [AllowAnonymous]
        [HttpGet("sedes/{idEmpresa}")]
        public IActionResult Sedes(int idEmpresa)
        {
            var result = _authService.ObtenerSedesPorEmpresa(idEmpresa);
            if (result.Errors.Any())
            {
                return GetObjectResult(result);
            }

            return Ok(result.Resultado);
        }
    }
}
