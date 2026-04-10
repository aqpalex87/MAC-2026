using MAC.Business.Entity.Layer.Entities;
using MAC.DTO.Dtos;
using System.Collections.Generic;

namespace MAC.Data.Access.Layer.Interfaces
{
    public interface IItemFlujoCajaRepository
    {
        decimal ObtenerNewIdFC();
        List<ItemFlujoCaja> ObtenerItemsFC(decimal idFC);
        List<FlujoCajaGufDto> ObtenerItemsFCGUF(decimal idFC);
        List<FlujoCajaRatioDto> ObtenerItemsRatios(decimal idFC);
    }
}
