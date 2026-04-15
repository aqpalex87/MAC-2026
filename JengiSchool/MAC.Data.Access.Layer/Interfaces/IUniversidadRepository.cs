using MAC.Business.Entity.Layer.Entities;
using System.Collections.Generic;

namespace MAC.Data.Access.Layer.Interfaces
{
    public interface IUniversidadRepository
    {
        (List<Universidad> Universidades, int TotalRows) ObtenerUniversidadesPaginado(int? idEmpresa, string nombre, int pageNumber, int pageSize);
        List<UniversidadDetalle> ObtenerDetallePorUniversidad(int idUniversidad);
        Universidad CrearUniversidad(Universidad universidad);
        bool ActualizarUniversidad(Universidad universidad);
        bool EliminarUniversidad(int idUniversidad);
        bool GuardarDetalleUniversidad(int idUniversidad, string detalleXml);
    }
}
