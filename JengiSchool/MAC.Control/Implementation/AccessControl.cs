using MAC.Control.DTO;
using MAC.Control.Interface;
using MAC.Control.Model;
using MAC.Control.Security;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using static MAC.Control.Util.Constants;

namespace MAC.Control.Implementation
{
    public class AccessControl : IAccessControl
    {
        private readonly ITokenControl _tokencontrol;
        private readonly IConfiguration _configuration;
        public string TokenSesion { get; set; }

        public AccessControl(IConfiguration configuration)
        {
            _tokencontrol = new TokenControl();
            _configuration = configuration;
        }

        public (AccessDto, string) GenerateToken(AccessDto usuariodto)
        {
            var tokenresponse = GenerarTokenJwt(usuariodto);
            usuariodto.FechaInicioVigencia = tokenresponse.FechaInicioVigencia;
            usuariodto.FechaFinVigencia = tokenresponse.FechaFinVigencia;

            return (usuariodto, tokenresponse.Token);
        }


        #region private methods
        private ResponseContainerModel GenerarTokenJwt(AccessDto oaccessdto)
        {
            var dicttokenparam = new Dictionary<string, string>
            {
                { ConstantesToken.Key, _configuration[ConstantesParametros.TokenClave] },
                { ConstantesToken.Minutes, _configuration[ConstantesParametros.TokenMinutos] }
            };

            var dictclaims = new Dictionary<string, string>
            {
                { ConstantesUsuario.CodigoUsuario, oaccessdto.CodigoUsuario.ToString() },
                { ConstantesUsuario.CorreoElectronico, oaccessdto.CorreoElectronico },
                { ConstantesUsuario.NombreUsuario, oaccessdto.NombreUsuario },
                { ConstantesGenerico.IdentificadorUnico, Guid.NewGuid().ToString() },
                { ConstantesUsuario.Perfil, oaccessdto.Perfil },
            };

            var responseToken = _tokencontrol.GenerateJwtToken(dicttokenparam, dictclaims);

            return responseToken;
        }

        #endregion

    }
}
