using MAC.DTO;
using MAC.DTO.Dtos;
using System.Collections.Generic;

namespace MAC.Business.Logic.Layer.Interfaces
{
    public interface IMenuRolService
    {
        Result<List<RolSimpleDto>> ObtenerRolesPorEmpresa(int idEmpresa);
        Result<List<MenuRolTreeDto>> ObtenerArbolMenusPorRol(int idRol);
        Result<bool> GuardarMenusRol(GuardarMenuRolRequestDto request);
    }
}
