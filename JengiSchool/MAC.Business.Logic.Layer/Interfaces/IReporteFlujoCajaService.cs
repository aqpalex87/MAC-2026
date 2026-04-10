using MAC.DTO.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAC.Business.Logic.Layer.Interfaces
{
    public interface IReporteFlujoCajaService
    {
        byte[] GetReporteFlujoCaja(FiltersReporteFlujoCajaDto filters);
        byte[] GetReporteFlujoCajaPorRango(decimal inicio, decimal fin);
        //ReporteFlujoCajaMasterDto ReporteFlujoCajaId(FiltersReporteFlujoCajaDto filters);
    }
}
