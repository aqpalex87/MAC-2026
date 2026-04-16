using MAC.Business.Logic.Layer.Interfaces;
using MAC.DTO.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace MAC.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UniversidadesController : CustomControllerBase
    {
        private readonly IUniversidadService _universidadService;

        public UniversidadesController(IUniversidadService universidadService)
        {
            _universidadService = universidadService;
        }

        [HttpGet]
        public IActionResult ObtenerPaginado([FromQuery] int? idEmpresa, [FromQuery] string nombre = "", [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var result = _universidadService.ObtenerUniversidadesPaginado(idEmpresa, nombre, pageNumber, pageSize);
            if (result.Errors.Any())
            {
                return GetObjectResult(result);
            }
            return Ok(result.Resultado);
        }

        [HttpGet("combo")]
        public IActionResult ObtenerCombo([FromQuery] int? idEmpresa)
        {
            var result = _universidadService.ObtenerUniversidadesCombo(idEmpresa);
            if (result.Errors.Any())
            {
                return GetObjectResult(result);
            }
            return Ok(result.Resultado);
        }

        [HttpGet("{idUniversidad}/detalle")]
        public IActionResult ObtenerDetalle(int idUniversidad)
        {
            var result = _universidadService.ObtenerDetallePorUniversidad(idUniversidad);
            if (result.Errors.Any())
            {
                return GetObjectResult(result);
            }
            return Ok(result.Resultado);
        }

        [HttpPost]
        public IActionResult Crear([FromBody] UniversidadDto request)
        {
            var result = _universidadService.CrearUniversidad(request);
            if (result.Errors.Any())
            {
                return GetObjectResult(result);
            }
            return Ok(result.Resultado);
        }

        [HttpPut("{idUniversidad}")]
        public IActionResult Actualizar(int idUniversidad, [FromBody] UniversidadDto request)
        {
            var result = _universidadService.ActualizarUniversidad(idUniversidad, request);
            if (result.Errors.Any())
            {
                return GetObjectResult(result);
            }
            return Ok(result.Resultado);
        }

        [HttpDelete("{idUniversidad}")]
        public IActionResult Eliminar(int idUniversidad)
        {
            var result = _universidadService.EliminarUniversidad(idUniversidad);
            if (result.Errors.Any())
            {
                return GetObjectResult(result);
            }
            return Ok(new { eliminado = result.Resultado });
        }
    }
}
