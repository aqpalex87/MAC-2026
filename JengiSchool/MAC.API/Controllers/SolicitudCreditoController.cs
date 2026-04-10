using MAC.Business.Logic.Layer.Interfaces;
using MAC.DTO.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace MAC.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SolicitudCreditoController : CustomControllerBase
    {
        private readonly ISolicitudCreditoService _solicitudCreditoService;

        public SolicitudCreditoController(ISolicitudCreditoService solicitudCreditoService)
        {
            _solicitudCreditoService = solicitudCreditoService;
        }

        /// <summary>
        /// Obtene una lista de Solicitudes de Crédito en base a los filtros de Id FC, N° Solicitud, N° Documento y nombres
        /// </summary>
        /// <param name="solicitud"></param>
        /// <returns></returns>
        [HttpPost("obtener")]
        public ActionResult<IEnumerable<SolicitudCreditoDto>> ObtenerSolicitudesCredito(FilterSolicitudCreditoDto solicitud)
        {
            var response = _solicitudCreditoService.ObtenerSolicitudesCredito(solicitud, UserJwt);


            return Ok(response);
        }

        /// <summary>
        /// Obtiene una Solicitud de Crédito por el número y el N° de documento
        /// </summary>
        [HttpPost]
        public ActionResult<SolicitudCreditoDto> GetByNum(FilterSolicitudCreditoDto solicitud,string vista)
        {
            var response = _solicitudCreditoService.GetByNum(solicitud,vista);
            return Ok(response);
        }

    }
}
