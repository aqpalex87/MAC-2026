using MAC.DTO;
using MAC.DTO.Dtos;

namespace MAC.Business.Logic.Layer.Interfaces
{
    public interface ICarnetService
    {
        Result<CarnetListadoPaginadoDto> ObtenerListado(int idEmpresa, int? idSede, string filtro, int pageNumber, int pageSize);
    }
}
