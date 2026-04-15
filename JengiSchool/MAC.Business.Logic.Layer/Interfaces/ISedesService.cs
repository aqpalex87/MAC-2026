using MAC.DTO;
using MAC.DTO.Dtos;
using System.Collections.Generic;

namespace MAC.Business.Logic.Layer.Interfaces
{
    public interface ISedesService
    {
        Result<List<SedesDto>> ObtenerSedesPorEmpresa(int idEmpresa);
        Result<SedesPaginadoDto> ObtenerSedesPaginado(int? idEmpresa, string nombre, int pageNumber, int pageSize);
        Result<SedesDto> CrearSede(SedesDto request);
        Result<SedesDto> ActualizarSede(int idSede, SedesDto request);
        Result<bool> EliminarSede(int idSede);
    }
}
