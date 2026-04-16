using MAC.DTO;
using MAC.DTO.Dtos;
using System;
using System.Collections.Generic;

namespace MAC.Business.Logic.Layer.Interfaces
{
    public interface IAsistenciaService
    {
        Result<AsistenciaPaginadoDto> ObtenerPaginado(int idEmpresa, int? idSede, string dni, DateTime? fechaInicio, DateTime? fechaFin, int? idParamEvento, int pageNumber, int pageSize);
        Result<List<AsistenciaListadoDto>> ObtenerParaExportar(int idEmpresa, int? idSede, string dni, DateTime? fechaInicio, DateTime? fechaFin, int? idParamEvento);
        Result<AsistenciaRegistroRespuestaDto> RegistrarManual(int idEmpresa, int? idSede, AsistenciaRegistroManualDto request);
    }
}
