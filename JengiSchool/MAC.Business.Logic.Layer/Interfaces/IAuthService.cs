using MAC.DTO;
using MAC.DTO.Dtos;
using System.Collections.Generic;

namespace MAC.Business.Logic.Layer.Interfaces
{
    public interface IAuthService
    {
        Result<AuthLoginResponseDto> Login(AuthLoginRequestDto request);
        Result<List<MenuDto>> ObtenerMenusPorUsuario(string usuario, int? idEmpresa, int? idSede);
        Result<List<EmpresaAuthDto>> ObtenerEmpresas();
        Result<List<SedeAuthDto>> ObtenerSedesPorEmpresa(int idEmpresa);
    }
}
