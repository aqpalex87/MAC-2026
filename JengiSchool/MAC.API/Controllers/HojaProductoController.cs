using MAC.Business.Logic.Layer.Interfaces;
using MAC.DTO.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Mime;
using System.Text;

namespace MAC.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class HojaProductoController : CustomControllerBase
    {
        private readonly IHojaProductoService _hojaProductoService;

        public HojaProductoController(IHojaProductoService hojaProductoService)
        {
            _hojaProductoService = hojaProductoService;
        }

        /// <summary>
        /// Obtiene las hojas de producto según el código de ubigeo de departamento de la SC.
        /// </summary>
        [HttpGet("{ubigeoDep}")]
        public ActionResult<List<HojaProductoDto>> Get(string ubigeoDep)
        {
            var hojas = _hojaProductoService.GetAllByUbigeoDep(ubigeoDep);
            return Ok(hojas);
        }

        /// <summary>
        /// Permite la descarga de un archivo desde el repositorio de Laserfiche
        /// </summary>
        [HttpGet("downloadFile")]
        public ActionResult DownloadFile(int codigoLaserfiche)
        { 
            var laserFicheResponse = _hojaProductoService.DownloadFile(codigoLaserfiche);
            byte[] array = laserFicheResponse.Data.ArrayBytes;
            string name = laserFicheResponse.Data.NombreDocumento;
            Response.Headers.Add("Access-Control-Expose-Headers", "File-Name");
            Response.Headers.Add("File-Name", name);
            return File(array, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", name);            
        }
    }
}
