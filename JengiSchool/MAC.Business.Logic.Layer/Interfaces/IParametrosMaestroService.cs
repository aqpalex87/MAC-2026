using MAC.DTO;
using MAC.DTO.Dtos;
using System.Collections.Generic;

namespace MAC.Business.Logic.Layer.Interfaces
{
    public interface IParametrosMaestroService
    {
        Result<List<ParametroListaDto>> ObtenerPorTipoCodigo(string codigoTipo);
    }
}
