using MAC.Business.Entity.Layer.Entities;
using System.Collections.Generic;

namespace MAC.Data.Access.Layer.Interfaces
{
    public interface IEmpresaRepository
    {
        (List<Empresa> Empresas, int TotalRows) ObtenerEmpresasPaginado(string nombre, int pageNumber, int pageSize);
        Empresa CrearEmpresa(Empresa empresa);
        bool ActualizarEmpresa(Empresa empresa);
        bool EliminarEmpresa(int idEmpresa);
    }
}
