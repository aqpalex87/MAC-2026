using MAC.Business.Entity.Layer;
using MAC.DTO;
using MAC.DTO.Dtos;
using System.Threading.Tasks;

namespace MAC.Business.Logic.Layer.Interfaces
{
    public interface ILoginExternoService
    {
        Task<Result<LoginDTO>> LoginToken(LoginTokenRequest loginTokenRequest);
        Result<LoginNewDTO<ValidateToken>> ValidarToken(string token);
        Result<LoginDTO> ActualizarToken(string token, string estado);
        Task<Result<LoginNewDTO<UserToken>>> AuthenticateExterno(LoginRequest oLogin);
        Task<Result<LoginDTO>> ObtenerDatosUsuario(LoginRequest oLogin);
    }
}
