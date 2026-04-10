using MAC.Business.Logic.Layer.Interfaces;
using MAC.DTO.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace MAC.API.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ParametroVersionController : CustomControllerBase
    {
        private readonly IParametroVersionService _parametroVersionService;

        public ParametroVersionController(IParametroVersionService parametroVersionService)
        {
            _parametroVersionService = parametroVersionService;
        }

        /// <summary>
        /// Obtiene todos los parámetros versión
        /// </summary>
        /// <returns></returns>
        [HttpGet()]
        public IActionResult ObtenerParametrosVersion()
        {
            var response = _parametroVersionService.ObtenerParametrosVersion();
            return Ok(response);
        }

        /// <summary>
        /// Obtiene el párámetro versión y sus detalles por el código 
        /// </summary>
        /// <param name="codigoVersion"></param>
        /// <returns></returns>
        [HttpGet("{codigoVersion}")]
        public IActionResult ObtenerParametroVersionPorCodigo(string codigoVersion)
        {
            var response = _parametroVersionService.ObtenerParametroVersionPorCodigo(codigoVersion);
            return Ok(response);
        }

        /// <summary>
        /// Guarda el parámetro versión y sus detalles
        /// </summary>
        /// <param name="parametroVersionDto"></param>
        /// <returns></returns>
        
        /*[AllowAnonymous]*/
        [HttpPost]
        public IActionResult GuardarParametroVersion(ParametroVersionDto parametroVersionDto)
        {
            var response = _parametroVersionService.GuardarParametroVersion(parametroVersionDto, UserJwt);
            return Ok(response);
        }

        /// <summary>
        /// Actualiza el parámetro versión a un estado determinado
        /// </summary>
        /// <param name="codigoVersion"></param>
        /// <param name="estado"></param>
        /// <returns></returns>
        [HttpPut("{codigoVersion}/{estado}")]
        public IActionResult ActualizarEstadoParametroVersion(string codigoVersion, string estado)
        {
            var response = _parametroVersionService.ActualizarEstadoParametroVersion(codigoVersion, estado, UserJwt);
            return Ok(response);
        }

        /// <summary>
        /// Obtiene el código de parámetro versión disponible y el código parámetro versión activo
        /// </summary>
        /// <returns></returns>
        [HttpGet("nuevoCodigoVersion")]
        public IActionResult ObtenerNuevoCodigoVersion()
        {
            var response = _parametroVersionService.ObtenerNuevoCodigoParametroVersion();
            return Ok(response);
        }

        /// <summary>
        /// Retorna los parametros activos del FC.
        /// </summary>
        [HttpGet("activo/{id}")]
        public IActionResult ObtenerParametroVersionActivo(int id)
        {
            var dtos = _parametroVersionService.ObtenerParametroVersionActivo(id);
            return Ok(dtos);
        }
    }
}
