using MAC.Business.Logic.Layer.Interfaces;
using MAC.DTO.Dtos;
using MAC.DTO.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace MAC.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemsFlujoCajaController : CustomControllerBase
    {
        private readonly IItemFlujoCajaService _itemFlujoCajaService;

        public ItemsFlujoCajaController(IItemFlujoCajaService itemFlujoCajaService)
        {
            _itemFlujoCajaService = itemFlujoCajaService;
        }

        /// <summary>
        /// Retona el GUF, ERA y ESFA del FC del ultimo credito desembolsado en caso exista.
        /// De lo contrario solo retornara los items.
        /// </summary>
        //[HttpGet("{nroDoc}")]
        //public IActionResult Get(string nroDoc)
        //{
        //    var wrappedItems = _itemFlujoCajaService.ObtenerItemsFC(nroDoc);
        //    return Ok(wrappedItems);
        //}

       
    }
}
