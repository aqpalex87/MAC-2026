using MAC.Business.Entity.Layer.Entities;
using System.Collections.Generic;

namespace MAC.Data.Access.Layer.Interfaces
{
    public interface IParametrosMaestroRepository
    {
        List<ParametroListaItem> ObtenerParametrosPorTipoCodigo(string codigoTipo);
    }
}
