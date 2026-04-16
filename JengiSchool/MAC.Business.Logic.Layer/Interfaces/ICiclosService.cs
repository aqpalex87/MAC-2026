using MAC.DTO;
using MAC.DTO.Dtos;

namespace MAC.Business.Logic.Layer.Interfaces
{
    public interface ICiclosService
    {
        Result<CicloPaginadoDto> ObtenerCiclosPaginado(int? idEmpresa, int? idSede, string nombre, int pageNumber, int pageSize);
        Result<CicloDto> CrearCiclo(CicloDto request);
        Result<CicloDto> ActualizarCiclo(int idCiclo, CicloDto request);
        Result<bool> EliminarCiclo(int idCiclo);
    }
}
