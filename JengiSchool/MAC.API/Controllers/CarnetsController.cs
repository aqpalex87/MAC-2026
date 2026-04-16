using MAC.Business.Logic.Layer.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace MAC.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CarnetsController : CustomControllerBase
    {
        private readonly ICarnetService _carnetService;

        public CarnetsController(ICarnetService carnetService)
        {
            _carnetService = carnetService;
        }

        /// <summary>
        /// Listado de alumnos con carnet para la empresa (y opcionalmente sede). Filtro por DNI, nombres, apellidos o carrera.
        /// </summary>
        [HttpGet("listado")]
        public IActionResult ObtenerListado(
            [FromQuery] int idEmpresa,
            [FromQuery] int? idSede = null,
            [FromQuery] string filtro = "",
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 25)
        {
            if (UserJwt.IdEmpresa.HasValue && UserJwt.IdEmpresa.Value > 0 && idEmpresa != UserJwt.IdEmpresa.Value)
            {
                return StatusCode(403, new { error = "No autorizado para esta empresa." });
            }

            var result = _carnetService.ObtenerListado(idEmpresa, idSede, filtro, pageNumber, pageSize);
            if (result.Errors.Any())
            {
                return GetObjectResult(result);
            }
            return Ok(result.Resultado);
        }
    }
}
