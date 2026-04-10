using MAC.Business.Entity.Layer.Entities;
using MAC.Business.Logic.Layer.Implementation;
using MAC.Business.Logic.Layer.Interfaces;
using MAC.DTO;
using MAC.DTO.Constantes;
using MAC.DTO.Dtos;
using ClosedXML.Excel;
using DocumentFormat.OpenXml.Presentation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MAC.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class FlujoCajaController : CustomControllerBase
    {
        private readonly IFlujoCajaService _flujoCajaService;
        private readonly ILoginExternoService _loginExternoService;

        public FlujoCajaController(IFlujoCajaService flujoCajaService, ILoginExternoService loginExternoService)
        {
            _flujoCajaService = flujoCajaService;
            _loginExternoService = loginExternoService;
        }

        /// <summary>
        /// Guarda un Flujo de Caja.
        /// </summary>
        [HttpPost]
        public ActionResult<FlujoCajaMasterDto> GuardarFlujoCaja(FlujoCajaMasterRequestDto flujoCajaDto)
        {
            var result = _flujoCajaService.GuardarFlujoCaja(flujoCajaDto, UserJwt);
            if (result.Errors.Any())
            {
                return GetObjectResult(result);
            }
            return Ok(result.Resultado);
        }

        /// <summary>
        /// Edita un Flujo de Caja cuyo estado es Pendiente u Observado.
        /// </summary>
    
        [HttpPut]
        [Route("editar")]
        public ActionResult<bool> EditarFlujoCaja([CustomizeValidator(Skip = true)] [FromBody] FlujoCajaMasterRequestDto flujoCajaDto)
        {
            var result = _flujoCajaService.EditarFlujoCaja(flujoCajaDto, UserJwt);
            if (result.Errors.Any())
            {
                return GetObjectResult(result);
            }
            return Ok(result.Resultado);
        }

        /// <summary>
        /// Obtiene un Flujo de Caja por el identificador.
        /// </summary>
        [HttpGet("{id}/{nroDocumento?}/{nroSolicitud?}/{vista?}")]
        public ActionResult<FlujoCajaMasterDto> GetFlujoCaja(int id,
                                                                string nroDocumento = null,
                                                                decimal nroSolicitud = 0,
                                                                string vista = null)
            {
            var result = _flujoCajaService.GetFlujoCajaById(id, nroDocumento, nroSolicitud,vista);
            if (result.Errors.Any())
            {
                return GetObjectResult(result);
            }
            return Ok(result.Resultado);
        }

        /// <summary>
        /// Finaliza un Flujo de Caja cuyo estado es Pendiente u Observado.
        /// </summary>
        [HttpPut("{idFc}/finalizar")]
        public IActionResult FinalizarFlujoCaja(int idFc)
        {
            var result = _flujoCajaService.FinalizarFlujoCaja(idFc, UserJwt);
            if (result.Errors.Any())
            {
                return GetObjectResult(result);
            }
            return Ok(result.Resultado);
        }

        /// <summary>
        /// Registra la observacion de revisión de un Flujo de Caja cuyo estado es Finalizado.
        /// </summary>
        [HttpPut("{idFc}/revisar")]
        public IActionResult SaveCommnetReviFlujoCaja(int idFc, [FromBody] FlujoCajaRevisionDto comment)
        {
            var result = _flujoCajaService.SaveCommentRevision(idFc, comment.Comment, UserJwt);
            if (result.Errors.Any())
            {
                return GetObjectResult(result);
            }
            return Ok(result.Resultado);
        }

        [HttpPost("loginToken")]
        public async Task<IActionResult> LoginToken(LoginTokenRequest loginTokenRequest)
        {
            if (loginTokenRequest.token == null && loginTokenRequest.URLApiAutenticate == null && loginTokenRequest.URLApiObtenerUsuario == null)
            {
                return Ok("Completa los datos Obligatorios");
            }
            var response = _loginExternoService.ValidarToken(loginTokenRequest.token);
            var oLogin = new LoginRequest()
            {
                URLApiObtenerUsuario = loginTokenRequest.URLApiObtenerUsuario,
                Username = response.Resultado.response.usuario,
                Opcion = response.Resultado.response.opcion,
            };
            Result<LoginDTO> result1 = await _loginExternoService.ObtenerDatosUsuario(oLogin);
            if (result1.Resultado != null)
            {
                UserToken DatosObtenidos = (UserToken)result1.Resultado.response;
                oLogin.Username = DatosObtenidos.vUsuarioWeb;
                oLogin.Password = DatosObtenidos.vPassword;
                oLogin.IdAplicacion = "";
                oLogin.URLApiAutenticate = loginTokenRequest.URLApiAutenticate;
                oLogin.SolCredito = response.Resultado.response.credito;
                oLogin.NumDocumento = response.Resultado.response.numeroDocumento;
                Result<LoginNewDTO<UserToken>> result = await _loginExternoService.AuthenticateExterno(oLogin);
                result.Resultado.response.vOpcion = oLogin.Opcion;
                result.Resultado.response.vSolCredito = oLogin.SolCredito;
                result.Resultado.response.vNumDocumento = oLogin.NumDocumento;
                result.Resultado.response.vIdFC = response.Resultado.response.idFC;
                if (result.Errors.Any())
                {
                    return GetObjectResult(result);
                }
                Result<LoginDTO> actualizar = _loginExternoService.ActualizarToken(loginTokenRequest.token, loginTokenRequest.estado);
                if (actualizar.Errors.Any())
                {
                    return GetObjectResult(actualizar);
                }
                return Ok(result.Resultado);
            }
            else
            {
                return Ok("No Se obtuvieron Datos");
            }
        }

        [HttpPost("ValidarTokenActivo")]
        public IActionResult ValidarTokenActivo(string token)
        {
            var response = _loginExternoService.ValidarToken(token);
            return Ok(response.Resultado);
        }

        [HttpPost("ActualizarTokenActivo")]
        public IActionResult ActualizarTokenActivo(string token, string estado)
        {
            var response = _loginExternoService.ActualizarToken(token, estado);
            return Ok(response.Resultado);
        }

        [HttpPost("AutenticateExterno")]
        public async Task<IActionResult> AutenticateExterno(LoginRequest oLogin)
        {
            if (oLogin.Username == null && oLogin.URLApiAutenticate == null && oLogin.URLApiObtenerUsuario == null)
            {
                return Ok("Completa los datos Obligatorios");
            }
            Result<LoginDTO> result1 = await _loginExternoService.ObtenerDatosUsuario(oLogin);
            if (result1.Resultado != null)
            {
                UserToken DatosObtenidos = (UserToken)result1.Resultado.response;
                oLogin.Password = DatosObtenidos.vPassword;
                Result<LoginNewDTO<UserToken>> result = await _loginExternoService.AuthenticateExterno(oLogin);
                if (result.Errors.Any())
                {
                    return GetObjectResult(result);
                }
                return Ok(result.Resultado);
            }
            else
            {
                return Ok("No Se obtuvieron Datos");
            }


        }

        /// <summary>
        /// Obtener flujos de caja por filtro
        /// </summary>
        /// <param name="filtro"></param>
        /// <returns></returns>
        [HttpPost("obtener")]
        public ActionResult<IEnumerable<FlujoCajaDto>> ObtenerFlujosCaja(FilterFlujoCajaDto filtro)
        {
            var response = _flujoCajaService.ObtenerFlujosCaja(filtro);
            return Ok(response);
        }
        //[HttpPost("/actualizar")]
        //public IActionResult SaveCommnetReviFlujoCaja02(FlujoCajaObservado oObseervdo)
        //{
        //    var result = _flujoCajaService.SaveCommentRevision(oObseervdo.idf, oObseervdo.comment, UserJwt);
        //    if (result.Errors.Any())
        //    {
        //        return GetObjectResult(result);
        //    }
        //    return Ok(result.Resultado);
        //}


    }
}
