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
        [HttpGet]
        public IActionResult ObtenerSedes()
        {
            var response = _sedesService.ObtenerSedes(1);
            return Ok(response);
        }
    }
}
