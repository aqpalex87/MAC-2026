using MAC.Business.Entity.Layer.Entities;
using System.Collections.Generic;

namespace MAC.Data.Access.Layer.Interfaces
{
    public interface IParametroVersionRepository
    {

        public ParametroCodigo ObtenerNuevoCodigoParametroVersion();
        List<ParametroVersion> ObtenerParametrosVersion();
        bool GuardarParametroVersion(ParametroVersion parametroVersion);
        bool ActualizarEstadoParametroVersion(ParametroVersion parametroVersion);
        ParametroVersion ObtenerParametroVersionPorCodigo(string codigoVersion);
        ParametroVersion ObtenerParametroVersionActivo(int id);
    }
}
