using MAC.Business.Entity.Layer.Entities;

namespace MAC.Data.Access.Layer.Interfaces
{
    public interface ILoginExternoRepository
    {
        LoginExterno ValidarToken(string token);
        LoginResponse ActualizarToken(string token, string estado);
    }
}
