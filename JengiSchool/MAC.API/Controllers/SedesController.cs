using MAC.Business.Logic.Layer.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MAC.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]

 
    public class SedesController : CustomControllerBase
    {
        private readonly ISedesService _sedesService;

        public SedesController(ISedesService sedesService)
        {
            _sedesService = sedesService;
        }
        [HttpGet("{idEmpresa}")]
        public IActionResult ObtenerSedesPorEmpresa(int idEmpresa)
        {
            if (idEmpresa <= 0)
            {
                return BadRequest("idEmpresa es requerido.");
            }

            var response = _sedesService.ObtenerSedesPorEmpresa(idEmpresa);
            return Ok(response);
        }
    }
}
