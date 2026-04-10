using MAC.Business.Entity.Layer;
using MAC.Business.Entity.Layer.Entities;
using MAC.Business.Entity.Layer.Interfaces;
using MAC.Business.Entity.Layer.Utils;
using MAC.Business.Logic.Layer.Interfaces;
using MAC.Data.Access.Layer.Interfaces;
using MAC.DTO;
using MAC.DTO.Dtos;
using AutoMapper;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using MAC.DTO.Constantes;
using System.Threading.Tasks;
using DocumentFormat.OpenXml.Presentation;

namespace MAC.Business.Logic.Layer.Implementation
{
    public class LoginExternoService : ILoginExternoService
    {
        private readonly ILoginExternoRepository _LoginRepository;
        private readonly IMapper _mapper;
        public LoginExternoService(ILoginExternoRepository LoginRepository, IMapper mapper)
        {
            _LoginRepository = LoginRepository;
            _mapper = mapper;
        }

        public async Task<Result<LoginDTO>> LoginToken(LoginTokenRequest loginTokenRequest)
        {
            var validarToken = ValidarToken(loginTokenRequest.token);

            var oLogin = new LoginRequest()
            {
                URLApiObtenerUsuario = loginTokenRequest.URLApiObtenerUsuario,
                Username = validarToken.Resultado.response.usuario
            };

            Result<LoginDTO> result1 = await ObtenerDatosUsuario(oLogin);

            return result1;
        }

        public Result<LoginNewDTO<ValidateToken>> ValidarToken(string token)
         {
            try
            {
                var existeToken = _LoginRepository.ValidarToken(token);
                if (existeToken == null)
                {
                    return new Result<LoginNewDTO<ValidateToken>>
                    {
                        Resultado = new LoginNewDTO<ValidateToken>
                        {
                            codigo = "0001",
                            estado = "OK",
                            mensaje = "No cuenta con token"
                        }
                    };
                }
                var validateToken = new ValidateToken()
                {
                    credito = existeToken.Credito,
                    numeroDocumento = existeToken.NumeroDocumento,
                    usuario = existeToken.Usuario,
                    opcion = existeToken.Opcion,
                    idFC = existeToken.IdFC,
                };
                string codigo;
                string mensaje;
                if (string.IsNullOrEmpty(existeToken.Usuario))
                {
                    codigo = "0002";
                    mensaje = "No cuenta con token activo";
                }
                else
                {
                    codigo = "0000";
                    mensaje = "Token activo";
                }

                return new Result<LoginNewDTO<ValidateToken>>
                {
                    Resultado = new LoginNewDTO<ValidateToken>
                    {
                        codigo = codigo,
                        estado = "OK",
                        mensaje = mensaje,
                        response = validateToken
                    }
                };

            }
            catch (Exception ex)
            {
                return new Result<LoginNewDTO<ValidateToken>>
                {
                    Resultado = new LoginNewDTO<ValidateToken>
                    {
                        codigo = "ERROR",
                        estado = "ERROR",
                        mensaje = "Ocurrió un error al validar el token: " + ex.Message
                    }
                };
            }
        }

        public Result<LoginDTO> ActualizarToken(string token, string estado)
        {
            try
            {
                var updatetoken = _LoginRepository.ActualizarToken(token, estado);

                if (updatetoken == null)
                {
                    return new Result<LoginDTO>
                    {
                        Resultado = new LoginDTO
                        {
                            codigo = "0001",
                            estado = "OK",
                            mensaje = "No se actualizo token"
                        }
                    };
                }
                else
                {
                    return new Result<LoginDTO>
                    {
                        Resultado = new LoginDTO
                        {
                            codigo = "0000",
                            estado = "OK",
                            mensaje = "Se actualizo correctamente token",
                            response = updatetoken
                        }
                    };
                }
            }
            catch (Exception ex)
            {
                return new Result<LoginDTO>
                {
                    Resultado = new LoginDTO
                    {
                        codigo = "ERROR",
                        estado = "ERROR",
                        mensaje = "Ocurrió un error al validar el token: " + ex.Message
                    }
                };
            }
        }
        public async Task<Result<LoginNewDTO<UserToken>>> AuthenticateExterno(LoginRequest oLogin)
        {
            try
            {
                UserToken userToken = new UserToken();
                string apiUrl = oLogin.URLApiAutenticate;
                var requestData = new
                {
                    Username = oLogin.Username,
                    Password = oLogin.Password,
                    IpClient = oLogin.IpCliente,
                    IdAplicacion = oLogin.IdAplicacion,
                    UrlPathName = oLogin.UrlPathName,
                    UrlAcceso = oLogin.UrlAcceso,
                };

                // Serializar el objeto JSON a una cadena
                string jsonRequest = Newtonsoft.Json.JsonConvert.SerializeObject(requestData);

                // Crear una instancia de HttpClient (debe ser compartida en toda la aplicación)
                using (HttpClient httpClient = new HttpClient())
                {
                    // Configurar la solicitud HTTP POST
                    var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

                    // Realizar la solicitud POST de manera asincrónica
                    HttpResponseMessage response = await httpClient.PostAsync(apiUrl, content);

                    // Verificar si la solicitud fue exitosa
                    if (response.IsSuccessStatusCode)
                    {
                        // Leer la respuesta como una cadena JSON
                        string jsonResponse = await response.Content.ReadAsStringAsync();

                        // Deserializar la respuesta JSON a un objeto si es necesario
                        userToken = JsonConvert.DeserializeObject<UserToken>(jsonResponse);
                        return new Result<LoginNewDTO<UserToken>>
                        {
                            Resultado = new LoginNewDTO<UserToken>
                            {
                                codigo = "0000",
                                estado = "OK",
                                mensaje = "Autenticación exitosa",
                                response = userToken
                            }
                        };
                    }
                    else
                    {
                        return new Result<LoginNewDTO<UserToken>>
                        {
                            Resultado = new LoginNewDTO<UserToken>
                            {
                                codigo = response.StatusCode.ToString(),
                                estado = "OK",
                                mensaje = "No se pudo autenticar",
                                response = userToken
                            }
                        };

                    }
                }

            }
            catch (HttpRequestException ex)
            {
                // Manejar errores de solicitud HTTP
                return new Result<LoginNewDTO<UserToken>>
                {
                    Resultado = new LoginNewDTO<UserToken>
                    {
                        codigo = "ERROR",
                        estado = "ERROR",
                        mensaje = "Error de solicitud HTTP: " + ex.Message
                    }
                };
            }
            catch (JsonException ex)
            {
                // Manejar errores de deserialización JSON
                return new Result<LoginNewDTO<UserToken>>
                {
                    Resultado = new LoginNewDTO<UserToken>
                    {
                        codigo = "ERROR",
                        estado = "ERROR",
                        mensaje = "Error de deserialización JSON: " + ex.Message
                    }
                };
            }
            catch (Exception ex)
            {
                // Manejar otros errores
                return new Result<LoginNewDTO<UserToken>>
                {
                    Resultado = new LoginNewDTO<UserToken>
                    {
                        codigo = "ERROR",
                        estado = "ERROR",
                        mensaje = "Ocurrió un error: " + ex.Message
                    }
                };
            }

        }

        public async Task<Result<LoginDTO>> ObtenerDatosUsuario(LoginRequest oLogin)
        {
            try
            {
                UserToken DatosUsuario = new UserToken();
                string apiUrl = oLogin.URLApiObtenerUsuario;
                var requestData = new
                {
                    Token = "",
                    UsuarioWeb = oLogin.Username,

                };

                // Serializar el objeto JSON a una cadena
                string jsonRequest = Newtonsoft.Json.JsonConvert.SerializeObject(requestData);

                // Crear una instancia de HttpClient (debe ser compartida en toda la aplicación)
                using (HttpClient httpClient = new HttpClient())
                {
                    // Configurar la solicitud HTTP POST
                    var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

                    // Realizar la solicitud POST de manera asincrónica
                    HttpResponseMessage response = await httpClient.PostAsync(apiUrl, content);

                    // Verificar si la solicitud fue exitosa
                    if (response.IsSuccessStatusCode)
                    {
                        // Leer la respuesta como una cadena JSON
                        string jsonResponse = await response.Content.ReadAsStringAsync();

                        // Deserializar la respuesta JSON a un objeto si es necesario
                        DatosUsuario = JsonConvert.DeserializeObject<UserToken>(jsonResponse);
                        return new Result<LoginDTO>
                        {
                            Resultado = new LoginDTO
                            {
                                codigo = "0000",
                                estado = "OK",
                                mensaje = "Consulta de datos exitosa",
                                response = DatosUsuario
                            }
                        };
                    }
                    else
                    {
                        return new Result<LoginDTO>
                        {
                            Resultado = new LoginDTO
                            {
                                codigo = response.StatusCode.ToString(),
                                estado = "OK",
                                mensaje = "No se pudo obtener datos",
                                response = DatosUsuario
                            }
                        };

                    }
                }

            }
            catch (HttpRequestException ex)
            {
                // Manejar errores de solicitud HTTP
                return new Result<LoginDTO>
                {
                    Resultado = new LoginDTO
                    {
                        codigo = "ERROR",
                        estado = "ERROR",
                        mensaje = "Error de solicitud HTTP: " + ex.Message
                    }
                };
            }
            catch (JsonException ex)
            {
                // Manejar errores de deserialización JSON
                return new Result<LoginDTO>
                {
                    Resultado = new LoginDTO
                    {
                        codigo = "ERROR",
                        estado = "ERROR",
                        mensaje = "Error de deserialización JSON: " + ex.Message
                    }
                };
            }
            catch (Exception ex)
            {
                // Manejar otros errores
                return new Result<LoginDTO>
                {
                    Resultado = new LoginDTO
                    {
                        codigo = "ERROR",
                        estado = "ERROR",
                        mensaje = "Ocurrió un error: " + ex.Message
                    }
                };
            }

        }

    }
}
