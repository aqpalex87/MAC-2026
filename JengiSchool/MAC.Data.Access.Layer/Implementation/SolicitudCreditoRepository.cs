using MAC.Business.Entity.Layer.Entities;
using MAC.Data.Access.Layer.DB2;
using MAC.Data.Access.Layer.Extensions;
using MAC.Data.Access.Layer.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;

namespace MAC.Data.Access.Layer.Implementation
{
    public class SolicitudCreditoRepository : ISolicitudCreditoRepository
    {
        private readonly string cadenaConexion = null;

        public SolicitudCreditoRepository(DB2DataAccess db2Access)
        {
            cadenaConexion = db2Access.ObtConnectionStringSql();
        }

        public List<SolicitudCredito> ObtenerSolicitudesCredito(SolicitudCredito solicitud)
        {
            using SqlConnection sqlConnection = new(cadenaConexion);
            using SqlCommand command = new($"UP_MAC_SEL_SOLICITUDES_CREDITO", sqlConnection);
            var parametros = new List<SqlParameter>
                {
                    new SqlParameter("P_ID_FLUJO_CAJA", SqlDbType.Decimal) { Value = solicitud.IdFlujoCaja, Precision = 8},
                    new SqlParameter("P_NUMERO_SOLICITUD", SqlDbType.Decimal) { Value = solicitud.NumeroSolicitud, Precision = 12},
                    new SqlParameter("P_NUMERO_DOCUMENTO", SqlDbType.VarChar, 15) { Value = solicitud.NumeroDocumento.ToStringParameter() },
                    new SqlParameter("P_NOMBRES", SqlDbType.VarChar, 153) { Value = solicitud.Nombres.ToStringParameter() },
                    new SqlParameter("P_CODIGO_USUARIO", SqlDbType.VarChar, 10) { Value = solicitud.CodUsuario.ToStringParameter() }
                };
            command.Parameters.AddRange(parametros.ToArray());
            command.CommandType = CommandType.StoredProcedure;
            command.CommandTimeout = 180;

            sqlConnection.Open();
            using SqlDataReader dataReader = command.ExecuteReader();
            return dataReader.GetEntities<SolicitudCredito>();
        }

        public SolicitudCredito GetByNum(SolicitudCredito solicitud,string vista)
        {
            try
            {
                using SqlConnection sqlConnection = new(cadenaConexion);
                using SqlCommand command = new("UP_MAC_SEL_SOLICITUD_CREDITO_POR_NUM", sqlConnection);
                command.CommandType = CommandType.StoredProcedure;
                var parametros = new List<SqlParameter>
            {
                new SqlParameter("P_NRO_SOLICITUD", SqlDbType.Decimal) { Value = solicitud.NumeroSolicitud, Precision = 12 },
                new SqlParameter("P_NRO_DOC", SqlDbType.Char, 15) { Value = solicitud.NumeroDocumento.ToStringParameter() },

            };
                command.Parameters.AddRange(parametros.ToArray());
                command.CommandTimeout = 180;
                sqlConnection.Open();
                using SqlDataReader dataReader = command.ExecuteReader();
                if(vista.Equals("FC"))
                    return dataReader.GetEntity<SolicitudCredito>();
                else
                {
                    dataReader.NextResult();
                    return dataReader.GetEntity<SolicitudCredito>();
                }
            }
            catch (Exception ex)
            { throw ex; }
        }

    }
}
