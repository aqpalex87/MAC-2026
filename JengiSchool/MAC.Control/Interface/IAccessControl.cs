using MAC.Control.DTO;

namespace MAC.Control.Interface
{
    public interface IAccessControl
    {
        (AccessDto, string) GenerateToken(AccessDto usuariodto);
    }
}
