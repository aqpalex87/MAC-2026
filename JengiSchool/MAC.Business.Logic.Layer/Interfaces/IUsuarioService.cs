using MAC.DTO;
using MAC.DTO.Dtos;

namespace MAC.Business.Logic.Layer.Interfaces
{
    public interface IUsuarioService
    {
        Result<UsuarioPaginadoDto> ObtenerUsuariosPaginado(int? idEmpresa, string usuario, int pageNumber, int pageSize);
        Result<UsuarioDto> CrearUsuario(UsuarioDto request);
        Result<UsuarioDto> ActualizarUsuario(int idUsuario, UsuarioDto request);
        Result<bool> EliminarUsuario(int idUsuario);
    }
}
