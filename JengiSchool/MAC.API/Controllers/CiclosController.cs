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
    public class CiclosController : CustomControllerBase
    {
        private readonly ICiclosService _ciclosService;

        public CiclosController(ICiclosService ciclosService)
        {
            _ciclosService = ciclosService;
        }

        [HttpGet]
        public IActionResult ObtenerPaginado(
            [FromQuery] int? idEmpresa,
            [FromQuery] int? idSede,
            [FromQuery] string nombre = "",
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            var result = _ciclosService.ObtenerCiclosPaginado(idEmpresa, idSede, nombre, pageNumber, pageSize);
            if (result.Errors.Any())
            {
                return GetObjectResult(result);
            }
            return Ok(result.Resultado);
        }

        [HttpPost]
        public IActionResult Crear([FromBody] CicloDto request)
        {
            var result = _ciclosService.CrearCiclo(request);
            if (result.Errors.Any())
            {
                return GetObjectResult(result);
            }
            return Ok(result.Resultado);
        }

        [HttpPut("{idCiclo}")]
        public IActionResult Actualizar(int idCiclo, [FromBody] CicloDto request)
        {
            var result = _ciclosService.ActualizarCiclo(idCiclo, request);
            if (result.Errors.Any())
            {
                return GetObjectResult(result);
            }
            return Ok(result.Resultado);
        }

        [HttpDelete("{idCiclo}")]
        public IActionResult Eliminar(int idCiclo)
        {
            var result = _ciclosService.EliminarCiclo(idCiclo);
            if (result.Errors.Any())
            {
                return GetObjectResult(result);
            }
            return Ok(new { eliminado = result.Resultado });
        }
    }
}
