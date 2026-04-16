using MAC.Business.Logic.Layer.Interfaces;
using MAC.DTO.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;

namespace MAC.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AsistenciasController : CustomControllerBase
    {
        private readonly IAsistenciaService _asistenciaService;

        public AsistenciasController(IAsistenciaService asistenciaService)
        {
            _asistenciaService = asistenciaService;
        }

        [HttpGet]
        public IActionResult ObtenerPaginado(
            [FromQuery] string dni = "",
            [FromQuery] DateTime? fechaInicio = null,
            [FromQuery] DateTime? fechaFin = null,
            [FromQuery] int? idParamEvento = null,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 20)
        {
            int idEmpresa = UserJwt.IdEmpresa ?? 0;
            int? idSede = (UserJwt.IdSede ?? 0) > 0 ? UserJwt.IdSede : null;
            var result = _asistenciaService.ObtenerPaginado(idEmpresa, idSede, dni, fechaInicio, fechaFin, idParamEvento, pageNumber, pageSize);
            if (result.Errors.Any())
            {
                return GetObjectResult(result);
            }
            return Ok(result.Resultado);
        }

        [HttpGet("exportar")]
        public IActionResult Exportar(
            [FromQuery] string dni = "",
            [FromQuery] DateTime? fechaInicio = null,
            [FromQuery] DateTime? fechaFin = null,
            [FromQuery] int? idParamEvento = null)
        {
            int idEmpresa = UserJwt.IdEmpresa ?? 0;
            int? idSede = (UserJwt.IdSede ?? 0) > 0 ? UserJwt.IdSede : null;
            var result = _asistenciaService.ObtenerParaExportar(idEmpresa, idSede, dni, fechaInicio, fechaFin, idParamEvento);
            if (result.Errors.Any())
            {
                return GetObjectResult(result);
            }
            return Ok(result.Resultado);
        }

        [HttpPost("manual")]
        public IActionResult RegistrarManual([FromBody] AsistenciaRegistroManualDto request)
        {
            int idEmpresa = UserJwt.IdEmpresa ?? 0;
            int? idSede = (UserJwt.IdSede ?? 0) > 0 ? UserJwt.IdSede : null;
            var result = _asistenciaService.RegistrarManual(idEmpresa, idSede, request);
            if (result.Errors.Any())
            {
                return GetObjectResult(result);
            }
            return Ok(result.Resultado);
        }
    }
}
