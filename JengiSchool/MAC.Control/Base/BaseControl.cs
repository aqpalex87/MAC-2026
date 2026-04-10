using MAC.Control.Security;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using static MAC.Control.Util.Constants;

namespace MAC.Control.Base
{
    public class BaseControl
    {
        private readonly ITokenControl _tokencontrol;

        public BaseControl()
        {
            _tokencontrol = new TokenControl();
        }

        #region token
        public void ValidarTokenSesion(string token)
        {
            try
            {
                var paramkeytoken = ObtenerValorParametro(ConstantesParametros.TokenClave);
                _tokencontrol.IsTokenJwtValid(paramkeytoken, token);

            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        public string ObtenerValorClaimToken(string token, string tipoclaim)
        {
            try
            {
                token = token.Contains("Bearer ") ? token.Replace("Bearer ", "") : token;

                var paramkeytoken = ObtenerValorParametro(ConstantesParametros.TokenClave);

                var valorclaim = _tokencontrol.GetClaimValueByToken(paramkeytoken, tipoclaim, token);

                return valorclaim;
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        #endregion

        #region Parametros
        public string ObtenerValorParametro(string parametro)
        {
            var parametros = ObtenerParametros();

            var valorParametro = parametros.Find(x => x.llave == parametro) == null ? "" : parametros.Find(x => x.llave == parametro).valor;
            return valorParametro;
        }

        private List<ParametroControlDto> ObtenerParametros()
        {
            try
            {
                var configuration = new ConfigurationBuilder()
                   .SetBasePath(Directory.GetCurrentDirectory())
                   .AddJsonFile("appsettings.json", false)
                   .Build();

                var responseParametros = new List<ParametroControlDto> {
                                                        new ParametroControlDto {llave = "TokenClave" , valor = configuration["TokenClave"] },
                                                        new ParametroControlDto {llave = "TokenMinutos" , valor = configuration["TokenMinutos"] },
                                                        new ParametroControlDto {llave = "AppKey" , valor = configuration["AppKey"] },
                                                        new ParametroControlDto {llave = "AppCode" , valor = configuration["AppCode"] },

                                                        new ParametroControlDto {llave = "SQLApplicationNameEnableEncrip" , valor = configuration["SQLApplicationNameEnableEncrip"] },
                                                        new ParametroControlDto {llave = "SQLRegeditFolder" , valor = configuration["SQLRegeditFolder"] },
                                                        new ParametroControlDto {llave = "RegeditPass" , valor = configuration["RegeditPass"] },
                                                        new ParametroControlDto {llave = "APILaserfiche" , valor = configuration["APILaserfiche"] },
                                                        new ParametroControlDto {llave = "FolderConsultaLaserfiche" , valor = configuration["FolderConsultaLaserfiche"] },
                                                        new ParametroControlDto {llave = "FolderPlantillaLaserfiche" , valor = configuration["FolderPlantillaLaserfiche"] },


                                                        new ParametroControlDto {llave = "CorreoApplicationNameEnableEncrip" , valor = configuration["CorreoApplicationNameEnableEncrip"] },
                                                        new ParametroControlDto {llave = "CorreoApplicationName" , valor = configuration["CorreoApplicationName"] },
                                                        new ParametroControlDto {llave = "CorreoApplicationNameCNAEnableEncrip" , valor = configuration["CorreoApplicationNameCNAEnableEncrip"] },
                                                        new ParametroControlDto {llave = "CorreoApplicationNameCNA" , valor = configuration["CorreoApplicationNameCNA"] },

                                                        new ParametroControlDto {llave = "CorreoAsunto" , valor = configuration["CorreoAsunto"] },
                                                        new ParametroControlDto {llave = "rutaProdHabilitado" , valor = configuration["rutaProdHabilitado"] },
                                                        new ParametroControlDto {llave = "rutaPlantillaCorreosProd" , valor = configuration["rutaPlantillaCorreosProd"] },
                                                        new ParametroControlDto {llave = "AsuntoAsignar" , valor = configuration["CorreoAsuntoAsignar"] },
                                                        new ParametroControlDto {llave = "AsuntoDerivarOCM" , valor = configuration["AsuntoDerivarOCM"] },
                                                        new ParametroControlDto {llave = "AsuntoRechazoUDA" , valor = configuration["AsuntoRechazoUDA"] },
                                                        new ParametroControlDto {llave = "AsuntoRechazoOCM" , valor = configuration["AsuntoRechazoOCM"] },
                                                        new ParametroControlDto {llave = "AsuntoDerivarNotificacion" , valor = configuration["AsuntoDerivarNotificacion"] },
                                                        new ParametroControlDto {llave = "AsuntoRegistrarConsulta" , valor = configuration["CorreoAsuntoRegistrarConsulta"] },
                                                        new ParametroControlDto {llave = "CorreoBuzonAgrobancoConsultas" , valor = configuration["CorreoBuzonAgrobancoConsultas"] },
                };
                return responseParametros;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        #endregion
    }
}
