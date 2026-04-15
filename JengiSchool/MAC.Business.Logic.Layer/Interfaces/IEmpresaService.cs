using MAC.DTO;
using MAC.DTO.Dtos;

namespace MAC.Business.Logic.Layer.Interfaces
{
    public interface IEmpresaService
    {
        Result<EmpresaPaginadoDto> ObtenerEmpresasPaginado(string nombre, int pageNumber, int pageSize);
        Result<EmpresaDto> CrearEmpresa(EmpresaDto request);
        Result<EmpresaDto> ActualizarEmpresa(int idEmpresa, EmpresaDto request);
        Result<bool> EliminarEmpresa(int idEmpresa);
    }
}
