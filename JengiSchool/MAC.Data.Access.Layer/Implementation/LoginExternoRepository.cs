using MAC.Business.Entity.Layer.Entities;
using MAC.Business.Entity.Layer.Utils;
using MAC.Data.Access.Layer.DB2;
using MAC.Data.Access.Layer.Extensions;
using MAC.Data.Access.Layer.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using Microsoft.Data.SqlClient;
using System.Linq;
using System.Reflection;
using System.Text.Json;

namespace MAC.Data.Access.Layer.Implementation
{
    public class LoginExternoRepository : ILoginExternoRepository
    {
        private readonly string cadenaConexion;
        public LoginExternoRepository(DB2DataAccess db2Access)
        {
            cadenaConexion = db2Access.ObtConnectionStringSql();
        }
        public LoginExterno ValidarToken(string token)
        {
            using SqlConnection sqlConnection = new(cadenaConexion);
            using SqlCommand command = new("UP_MAC_PRO_VALIDAR_TOKEN", sqlConnection);
            command.CommandType = CommandType.StoredProcedure;
            var parametros = new List<SqlParameter>
            {
              new SqlParameter("p_TKNIDEN", SqlDbType.Char, 36) { Value = token },
               new SqlParameter("p_Usuario", SqlDbType.Char, 10) { Direction = ParameterDirection.Output },
                new SqlParameter("p_NumeroDocumento", SqlDbType.Char, 15) { Direction = ParameterDirection.Output },
                 new SqlParameter("p_Credito", SqlDbType.Decimal) { Precision = 12, Direction = ParameterDirection.Output },
                 new SqlParameter("p_Opcion", SqlDbType.Char, 50) { Direction = ParameterDirection.Output },
                 new SqlParameter("p_IdFC", SqlDbType.Char, 50) { Direction = ParameterDirection.Output }
            };
            command.Parameters.AddRange(parametros.ToArray());
            command.CommandTimeout = 180;
            sqlConnection.Open();
            using SqlDataReader dataReader = command.ExecuteReader();
            LoginExterno ologin = new LoginExterno();
            if (command.Parameters["p_Usuario"].Value != null && command.Parameters["p_Usuario"].Value != DBNull.Value)
             {
                ologin.Usuario = command.Parameters["p_Usuario"].Value.ToString().Trim();
            }
            if (command.Parameters["p_NumeroDocumento"].Value != null && command.Parameters["p_NumeroDocumento"].Value != DBNull.Value)
             {
                ologin.NumeroDocumento = command.Parameters["p_NumeroDocumento"].Value.ToString().Trim();
            }
            if (command.Parameters["p_Credito"].Value != null && command.Parameters["p_Credito"].Value != DBNull.Value)
            {
                decimal _credito = Convert.ToDecimal(command.Parameters["p_Credito"].Value);
                ologin.Credito = _credito > 0 ? _credito.ToString() : string.Empty;
            }
            if (command.Parameters["p_Opcion"].Value != null && command.Parameters["p_Opcion"].Value != DBNull.Value)
            {
                ologin.Opcion = command.Parameters["p_Opcion"].Value.ToString().Trim();
            }
            if (command.Parameters["p_IdFC"].Value != null && command.Parameters["p_IdFC"].Value != DBNull.Value)
            {
                ologin.IdFC = Convert.ToDecimal(command.Parameters["p_IdFC"].Value);
            }
            return ologin;
        }
        public LoginResponse ActualizarToken(string token, string estado)
        {
            using SqlConnection sqlConnection = new(cadenaConexion);
            using SqlCommand command = new("UP_MAC_UPD_TOKEN_ESTA", sqlConnection);
            command.CommandType = CommandType.StoredProcedure;

            var parametros = new List<SqlParameter>
            {
                new SqlParameter("p_TKNIDEN", SqlDbType.Char, 36) { Value = token.ToStringParameter() },
                new SqlParameter("P_TKNESTA", SqlDbType.Char, 1) { Value = estado.ToStringParameter() },
                new SqlParameter("VO_MSG", SqlDbType.VarChar, 150) { Direction = ParameterDirection.Output },
            };
            command.Parameters.AddRange(parametros.ToArray());
            sqlConnection.Open();
            command.ExecuteNonQuery();
            LoginResponse oLogin = new LoginResponse();
            oLogin.CodResupuesta = string.Empty;
            oLogin.Mensaje = string.Empty;
            oLogin.Mensaje = command.Parameters["VO_MSG"].Value?.ToString() ?? string.Empty;
            oLogin.CodResupuesta = (oLogin.Mensaje == "Registro actualizado correctamente") ? "OK" : "ERROR";
            return oLogin;
        }

    }
}
