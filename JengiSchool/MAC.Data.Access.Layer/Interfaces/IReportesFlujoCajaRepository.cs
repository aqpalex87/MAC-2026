using MAC.Business.Entity.Layer.Entities;
using MAC.DTO.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAC.Data.Access.Layer.Interfaces
{
    public interface IReportesFlujoCajaRepository
    {
        ReporteFlujoCajaMasterDto GetReporteFlujoCaja(FiltersReporteFlujoCajaDto filters);
        FlujoCajaReporteDataDto GetReporteFlujoCajaPorRango(decimal inicio, decimal fin);
    }
}
