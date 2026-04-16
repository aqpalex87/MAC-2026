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
    public class AlumnosController : CustomControllerBase
    {
        private readonly IAlumnoService _alumnoService;

        public AlumnosController(IAlumnoService alumnoService)
        {
            _alumnoService = alumnoService;
        }

        [HttpGet]
        public IActionResult ObtenerPaginado(
            [FromQuery] int? idEmpresa,
            [FromQuery] int? idSede,
            [FromQuery] string filtro = "",
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            var result = _alumnoService.ObtenerAlumnosPaginado(idEmpresa, idSede, filtro, pageNumber, pageSize);
            if (result.Errors.Any())
            {
                return GetObjectResult(result);
            }
            return Ok(result.Resultado);
        }

        [HttpGet("{idAlumno}")]
        public IActionResult ObtenerPorId(int idAlumno)
        {
            var result = _alumnoService.ObtenerAlumnoPorId(idAlumno);
            if (result.Errors.Any())
            {
                return GetObjectResult(result);
            }
            return Ok(result.Resultado);
        }

        [HttpPost]
        public IActionResult Crear([FromBody] AlumnoDto request)
        {
            var result = _alumnoService.CrearAlumno(request);
            if (result.Errors.Any())
            {
                return GetObjectResult(result);
            }
            return Ok(result.Resultado);
        }

        [HttpPut("{idAlumno}")]
        public IActionResult Actualizar(int idAlumno, [FromBody] AlumnoDto request)
        {
            var result = _alumnoService.ActualizarAlumno(idAlumno, request);
            if (result.Errors.Any())
            {
                return GetObjectResult(result);
            }
            return Ok(result.Resultado);
        }

        [HttpDelete("{idAlumno}")]
        public IActionResult Eliminar(int idAlumno)
        {
            var result = _alumnoService.EliminarAlumno(idAlumno);
            if (result.Errors.Any())
            {
                return GetObjectResult(result);
            }
            return Ok(new { eliminado = result.Resultado });
        }
    }
}
