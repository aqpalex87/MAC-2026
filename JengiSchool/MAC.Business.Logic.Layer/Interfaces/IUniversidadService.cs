using MAC.DTO;
using MAC.DTO.Dtos;
using System.Collections.Generic;

namespace MAC.Business.Logic.Layer.Interfaces
{
    public interface IUniversidadService
    {
        Result<UniversidadPaginadoDto> ObtenerUniversidadesPaginado(int? idEmpresa, string nombre, int pageNumber, int pageSize);
        Result<List<UniversidadDetalleDto>> ObtenerDetallePorUniversidad(int idUniversidad);
        Result<UniversidadDto> CrearUniversidad(UniversidadDto request);
        Result<UniversidadDto> ActualizarUniversidad(int idUniversidad, UniversidadDto request);
        Result<bool> EliminarUniversidad(int idUniversidad);
    }
}
