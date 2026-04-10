using MAC.Business.Entity.Layer;
using MAC.DTO.Dtos;
using System.Collections.Generic;

namespace MAC.Business.Logic.Layer.Interfaces
{
    public interface IParametroVersionService
    {
        ParametroCodigoDto ObtenerNuevoCodigoParametroVersion();
        List<ParametroVersionDto> ObtenerParametrosVersion();
        ParametroVersionDto ObtenerParametroVersionPorCodigo(string codigoVersion);
        bool GuardarParametroVersion(ParametroVersionDto parametroVersion, UserJwt userJWT);
        bool ActualizarEstadoParametroVersion(string codigoVersion, string estado, UserJwt userJWT);
        ParametroVersionDto ObtenerParametroVersionActivo(int id);
        
    }
}
