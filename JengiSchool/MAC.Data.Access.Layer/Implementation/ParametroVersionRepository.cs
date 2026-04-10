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
    public class ParametroVersionRepository : IParametroVersionRepository
    {
        private readonly string cadenaConexion = null;
        private readonly string esquemaDB2;

        public ParametroVersionRepository(DB2DataAccess db2Access)
        {
            cadenaConexion = db2Access.ObtConnectionStringSql();
            esquemaDB2 = db2Access.EsquemaDB2;
        }

        public ParametroCodigo ObtenerNuevoCodigoParametroVersion()
        {
            using SqlConnection sqlConnection = new(cadenaConexion);
            using SqlCommand command = new($"{esquemaDB2}.UP_MAC_SEL_VERSION_PARAMETROS_CODIGO_NUEVO", sqlConnection);
            command.CommandType = CommandType.StoredProcedure;
            sqlConnection.Open();

            using SqlDataReader dataReader = command.ExecuteReader();
            var parametroCodigo = dataReader.GetEntity<ParametroCodigo>();
            return parametroCodigo;

        }

        public List<ParametroVersion> ObtenerParametrosVersion()
        {
            using SqlConnection sqlConnection = new(cadenaConexion);
            using SqlCommand command = new($"{esquemaDB2}.UP_MAC_SEL_VERSION_PARAMETROS", sqlConnection);
            command.CommandType = CommandType.StoredProcedure;
            sqlConnection.Open();

            using SqlDataReader dataReader = command.ExecuteReader();
            var parametrosVersion = dataReader.GetEntities<ParametroVersion>();
            return parametrosVersion;
        }

        public ParametroVersion ObtenerParametroVersionPorCodigo(string codigoVersion)
        {
            using SqlConnection sqlConnection = new(cadenaConexion);
            using SqlCommand command = new($"{esquemaDB2}.UP_MAC_SEL_VERSION_PARAMETROS_DETALLE", sqlConnection);
            command.Parameters.Add(new SqlParameter("P_CODIGOVERSION", SqlDbType.Char, 8) { Value = codigoVersion });
            command.CommandType = CommandType.StoredProcedure;
            sqlConnection.Open();

            using SqlDataReader dataReader = command.ExecuteReader();
            var parametroVersion = dataReader.GetEntity<ParametroVersion>();
            if (parametroVersion != null)
            {
                LeerParametroDetalles(dataReader, parametroVersion);
            }
            return parametroVersion;
        }

        private static void LeerParametroDetalles(SqlDataReader dataReader, ParametroVersion parametroVersion)
        {
            dataReader.NextResult();
            parametroVersion.ParametrosGUF = dataReader.GetEntities<ParametroGUF>();
            dataReader.NextResult();
            parametroVersion.ParametrosDPD = dataReader.GetEntities<ParametroDPD>();
            dataReader.NextResult();
            parametroVersion.ParametrosDPI = dataReader.GetEntities<ParametroDPI>();
            dataReader.NextResult();
            parametroVersion.ParametrosRatio = dataReader.GetEntities<ParametroRatio>();
            dataReader.NextResult();
            parametroVersion.ParametrosTipoCliente = dataReader.GetEntities<ParametroTipoCliente>();
            dataReader.NextResult();
            parametroVersion.ParametrosRSECondicion = dataReader.GetEntities<ParametroRSECondicion>();
            dataReader.NextResult();
            parametroVersion.ParametrosComportamiento = dataReader.GetEntities<ParametroComportamiento>();
            dataReader.NextResult();
            parametroVersion.ParametrosAlerta = dataReader.GetEntities<ParametroAlerta>();
            dataReader.NextResult();
            parametroVersion.ParametrosESFA = dataReader.GetEntities<ParametroESFA>();
        }

        public bool GuardarParametroVersion(ParametroVersion parametroVersion)
        {
            try
            {
            var parametrosGUFJson = parametroVersion.ParametrosGUF.ConvertToJson();
            var parametrosDPDJson = parametroVersion.ParametrosDPD.ConvertToJson();
            var parametrosDPIJson = parametroVersion.ParametrosDPI.ConvertToJson();
            var parametrosRatioJson = parametroVersion.ParametrosRatio.ConvertToJson();
            var parametrosTipoClienteJson = parametroVersion.ParametrosTipoCliente.ConvertToJson();
            var parametrosRSECondicionJson = parametroVersion.ParametrosRSECondicion.ConvertToJson();
            var parametrosComportamientoJson = parametroVersion.ParametrosComportamiento.ConvertToJson();
            var parametrosAlertaJson = parametroVersion.ParametrosAlerta.ConvertToJson();
            var parametrosESFAJson = parametroVersion.ParametrosESFA.ConvertToJson();

                using SqlConnection sqlConnection = new(cadenaConexion);
            using SqlCommand command = new($"{esquemaDB2}.UP_MAC_PRO_GUARDAR_PARAMETROS_FC", sqlConnection);
            command.Parameters.Add(new SqlParameter("P_DESCRIPCION", SqlDbType.Char, 50) { Value = parametroVersion.DescripcionVersion });
            command.Parameters.Add(new SqlParameter("P_ESTADO", SqlDbType.Char, 1) { Value = parametroVersion.Estado });

            command.Parameters.Add(new SqlParameter("P_USUARIO_REGISTRO", SqlDbType.Char, 10) { Value = parametroVersion.UsuarioRegistro });
            command.Parameters.Add(new SqlParameter("P_FECHA_REGISTRO", SqlDbType.Decimal) { Value = parametroVersion.FechaRegistro, Precision = 8 });
            command.Parameters.Add(new SqlParameter("P_HORA_REGISTRO", SqlDbType.Decimal) { Value = parametroVersion.HoraRegistro, Precision = 6 });

            command.Parameters.Add(new SqlParameter("P_USUARIO_ULTIMA_ACTIVACION", SqlDbType.Char, 10) { Value = parametroVersion.UsuarioRegistro });
            command.Parameters.Add(new SqlParameter("P_FECHA_ULTIMA_ACTIVACION", SqlDbType.Decimal) { Value = parametroVersion.FechaRegistro, Precision = 8 });
            command.Parameters.Add(new SqlParameter("P_HORA_ULTIMA_ACTIVACION", SqlDbType.Decimal) { Value = parametroVersion.HoraRegistro, Precision = 6 });

            command.Parameters.Add(new SqlParameter("P_USUARIO_ULTIMA_INACTIVACION", SqlDbType.Char, 10) { Value = parametroVersion.UsuarioRegistro });
            command.Parameters.Add(new SqlParameter("P_FECHA_ULTIMA_INACTIVACION", SqlDbType.Decimal) { Value = parametroVersion.FechaRegistro, Precision = 8 });
            command.Parameters.Add(new SqlParameter("P_HORA_ULTIMA_INACTIVACION", SqlDbType.Decimal) { Value = parametroVersion.HoraRegistro, Precision = 6 });

            command.Parameters.Add(new SqlParameter("P_PARAMETROS_GUF_JSON", SqlDbType.VarChar, 10000) { Value = parametrosGUFJson });
            command.Parameters.Add(new SqlParameter("P_PARAMETROS_DPD_JSON", SqlDbType.VarChar, 10000) { Value = parametrosDPDJson });
            command.Parameters.Add(new SqlParameter("P_PARAMETROS_DPI_JSON", SqlDbType.VarChar, 10000) { Value = parametrosDPIJson });
            command.Parameters.Add(new SqlParameter("P_PARAMETROS_RATIO_JSON", SqlDbType.VarChar, 10000) { Value = parametrosRatioJson });
            command.Parameters.Add(new SqlParameter("P_PARAMETROS_TIPO_CLIENTE_JSON", SqlDbType.VarChar, 10000) { Value = parametrosTipoClienteJson });
            command.Parameters.Add(new SqlParameter("P_PARAMETROS_RSE_CONDICION_JSON", SqlDbType.VarChar, 10000) { Value = parametrosRSECondicionJson });
            command.Parameters.Add(new SqlParameter("P_PARAMETROS_COMPORTAMIENTO_JSON", SqlDbType.VarChar, 10000) { Value = parametrosComportamientoJson });
            command.Parameters.Add(new SqlParameter("P_PARAMETROS_ALERTA_JSON", SqlDbType.VarChar, 10000) { Value = parametrosAlertaJson });
            command.CommandType = CommandType.StoredProcedure;
            sqlConnection.Open();
            command.ExecuteNonQuery();
            return true;
            }
            catch (Exception ex)
            { throw ex; }
        }

        public ParametroVersion ObtenerParametroVersionActivo(int idFc)
        {
            using SqlConnection sqlConnection = new(cadenaConexion);
            using SqlCommand command = new("UP_MAC_SEL_PARAMETROS_FC", sqlConnection);
            var parametros = new List<SqlParameter>
            {
              new SqlParameter("P_IDFC", SqlDbType.Decimal) { Value = idFc, Precision = 8 },
            };

            command.Parameters.AddRange(parametros.ToArray());
            command.CommandType = CommandType.StoredProcedure;
            sqlConnection.Open();
            return GetParametroVersion(command);
        }

        public bool ActualizarEstadoParametroVersion(ParametroVersion parametroVersion)
        {
            try
            {
                using SqlConnection sqlConnection = new(cadenaConexion);
                using SqlCommand command = new($"{esquemaDB2}.UP_MAC_ACT_ESTADO_PARAMETROS_FC", sqlConnection);
                command.Parameters.Add(new SqlParameter("P_CODIGO_PARAMETRO_VERSION", SqlDbType.Char, 8) { Value = parametroVersion.CodigoVersion });
                command.Parameters.Add(new SqlParameter("P_ESTADO", SqlDbType.Char, 1) { Value = parametroVersion.Estado });
                command.Parameters.Add(new SqlParameter("P_USUARIO_MODIFICACION", SqlDbType.Char, 10) { Value = parametroVersion.UsuarioModificacion });
                command.Parameters.Add(new SqlParameter("P_FECHA_MODIFICACION", SqlDbType.Decimal) { Value = parametroVersion.FechaModificacion, Precision = 8 });
                command.Parameters.Add(new SqlParameter("P_HORA_MODIFICACION", SqlDbType.Decimal) { Value = parametroVersion.HoraModificacion, Precision = 6 });
                command.CommandType = CommandType.StoredProcedure;
                sqlConnection.Open();
                command.ExecuteNonQuery();
                return true;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        private static ParametroVersion GetParametroVersion(SqlCommand command)
        {
            using SqlDataReader dataReader = command.ExecuteReader();
            var paramVersion = dataReader.GetEntity<ParametroVersion>();
            paramVersion.ParametrosGUF = dataReader.NextResult<ParametroGUF>();
            paramVersion.ParametrosDPD = dataReader.NextResult<ParametroDPD>();
            paramVersion.ParametrosDPI = dataReader.NextResult<ParametroDPI>();
            paramVersion.ParametrosRatio = dataReader.NextResult<ParametroRatio>();
            paramVersion.ParametrosTipoCliente = dataReader.NextResult<ParametroTipoCliente>();
            paramVersion.ParametrosRSECondicion = dataReader.NextResult<ParametroRSECondicion>();
            paramVersion.ParametrosComportamiento = dataReader.NextResult<ParametroComportamiento>();
            paramVersion.ParametrosAlerta = dataReader.NextResult<ParametroAlerta>();
            paramVersion.ParametrosESFA = dataReader.NextResult<ParametroESFA>();
            return paramVersion;
        }
    }
}
