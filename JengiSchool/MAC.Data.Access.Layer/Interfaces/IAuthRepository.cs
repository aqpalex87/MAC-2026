using MAC.Business.Entity.Layer.Entities;
using System.Collections.Generic;

namespace MAC.Data.Access.Layer.Interfaces
{
    public interface IAuthRepository
    {
        UsuarioAuth ObtenerUsuario(string usuario);
        List<MenuRol> ObtenerMenusPorUsuario(string usuario);
    }
}
