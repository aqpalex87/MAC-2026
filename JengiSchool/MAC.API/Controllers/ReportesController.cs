using MAC.Business.Logic.Layer.Implementation;
using MAC.Business.Logic.Layer.Interfaces;
using MAC.DTO.Dtos;
using iText.StyledXmlParser.Jsoup.Nodes;
using Microsoft.AspNetCore.Mvc;
using ClosedXML.Excel;
using System.IO;
using System.Net.Http;
using System.Net;
using System;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using DocumentFormat.OpenXml.Spreadsheet;
using System.Linq;
using Microsoft.AspNetCore.Authorization;

namespace MAC.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ReportesController : CustomControllerBase
    {
        private readonly IReporteFlujoCajaService _reportesFlujoCajaService;
        private readonly IFlujoCajaService _flujoCajaService;

        public ReportesController(IReporteFlujoCajaService reportesFlujoCajaService, IFlujoCajaService flujoCajaService)
        {
            _reportesFlujoCajaService = reportesFlujoCajaService;
            _flujoCajaService = flujoCajaService;
        }

        /// <summary>
        /// Obtiene reporte Flujo de Caja por filtros.
        /// </summary>
        [HttpGet("obtener/{idFC}")]
        public async Task<IActionResult> GetReporteFlujoCaja(decimal idFC)
        {
            FiltersReporteFlujoCajaDto filters = new FiltersReporteFlujoCajaDto();
            filters.idFC = idFC;
            var response = _reportesFlujoCajaService.GetReporteFlujoCaja(filters);
            Response.Headers.Add("Access-Control-Expose-Headers", "File-Name");
            Response.Headers.Add("File-Name", "flujo_caja.xlsx");
            return File(response, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "flujo_caja.xlsx");
        }

        //[HttpPost]
        //public async Task<IActionResult> GetConsultaFlujoCaja(FiltersReporteFlujoCajaDto filters)
        //{
        //    var response = _reportesFlujoCajaService.GetConsultaFlujoCaja(filters);
        //    return 
        //}


        ///// <summary>
        ///// Obtiene un Flujo de Caja por el identificador.
        ///// </summary>
        //[HttpGet("{id}")]
        //public ActionResult<ReporteFlujoCajaMasterDto> GetFlujoCaja(decimal id)
        //{
        //    FiltersReporteFlujoCajaDto filters = new FiltersReporteFlujoCajaDto();
        //    filters.idFC = id;
        //    var response = _reportesFlujoCajaService.ReporteFlujoCajaId(filters);
        //    return Ok(response);
        //}

        [HttpGet("reporte-fc/{inicio}/{fin}")]
        public async Task<IActionResult> GetReporteFlujoCajaPorRango(decimal inicio, decimal fin)
        {

            var response = _reportesFlujoCajaService.GetReporteFlujoCajaPorRango(inicio, fin);
            Response.Headers.Add("Access-Control-Expose-Headers", "File-Name");
            Response.Headers.Add("File-Name", "ReporteFC.xlsx");
            return File(response, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "ReporteFC.xlsx");
        }

        [HttpGet("anios")]
        public async Task<IActionResult> GetYearsFromFC()
        {
            var result = _flujoCajaService.GetYearsFromFC();
            if (result.Errors.Any())
            {
                return GetObjectResult(result);
            }
            return Ok(result.Resultado);
        }

    }
}
