using MAC.Business.Entity.Layer;
using MAC.DTO;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Net;
using static MAC.Control.Util.Constants;

namespace MAC.API.Controllers
{
    public class CustomControllerBase : ControllerBase
    {
        public UserJwt UserJwt
        {
            get
            {
                UserJwt userJWT = new();
                userJWT.Perfil = User.Claims.FirstOrDefault(claim => claim.Type == ConstantesUsuario.Perfil)?.Value;
                userJWT.NroDocumento = User.Claims.FirstOrDefault(claim => claim.Type == ConstantesUsuario.NumeroDocumento)?.Value;
                userJWT.Nombre = User.Claims.FirstOrDefault(claim => claim.Type == ConstantesUsuario.NombreUsuario)?.Value;
                userJWT.CodUsuario = User.Claims.FirstOrDefault(claim => claim.Type == ConstantesUsuario.CodigoUsuario)?.Value;
                return userJWT;
            }

        }

        public ObjectResult GetObjectResult<T>(Result<T> result)
        {
            return StatusCode((int)result.Status, new ValidationProblemDetails(result.Errors));
        }

    }
}
