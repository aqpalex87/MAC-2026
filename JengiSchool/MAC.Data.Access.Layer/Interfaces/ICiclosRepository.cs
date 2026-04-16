using MAC.Business.Entity.Layer.Entities;
using System.Collections.Generic;

namespace MAC.Data.Access.Layer.Interfaces
{
    public interface ICiclosRepository
    {
        (List<Ciclo> Ciclos, int TotalRows) ObtenerCiclosPaginado(int? idEmpresa, int? idSede, string nombre, int pageNumber, int pageSize);
        Ciclo CrearCiclo(Ciclo ciclo);
        bool ActualizarCiclo(Ciclo ciclo);
        bool EliminarCiclo(int idCiclo);
    }
}
