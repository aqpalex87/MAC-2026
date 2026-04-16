using MAC.Business.Entity.Layer.Entities;
using System.Collections.Generic;

namespace MAC.Data.Access.Layer.Interfaces
{
    public interface ICarnetRepository
    {
        (List<CarnetListadoRow> Items, int TotalRows) ObtenerListado(int idEmpresa, int? idSede, string filtro, int pageNumber, int pageSize);
    }
}
