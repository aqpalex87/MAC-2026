using MAC.Business.Entity.Layer.Entities;
using MAC.Data.Access.Layer.DB2;
using MAC.Data.Access.Layer.Extensions;
using MAC.Data.Access.Layer.Interfaces;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;

namespace MAC.Data.Access.Layer.Implementation
{
    public class AsistenciaRepository : IAsistenciaRepository
    {
        private readonly string cadenaConexion;
        private readonly string esquemaDB2;

        public AsistenciaRepository(DB2DataAccess db2Access)
        {
            cadenaConexion = db2Access.ObtConnectionStringSql();
            esquemaDB2 = db2Access.EsquemaDB2;
        }

        public (List<AsistenciaListadoRow> Items, int TotalRows) ObtenerPaginado(
            int idEmpresa,
            int? idSede,
            string dni,
            DateTime? fechaInicio,
            DateTime? fechaFin,
            int? idParamEvento,
            int pageNumber,
            int pageSize)
        {
            using SqlConnection sqlConnection = new(cadenaConexion);
            using SqlCommand command = new($"{esquemaDB2}.MAC_SELECT_ASISTENCIAS_PAGINADO", sqlConnection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.Add(new SqlParameter("@IdEmpresa", SqlDbType.Int) { Value = idEmpresa });
            command.Parameters.Add(new SqlParameter("@IdSede", SqlDbType.Int) { Value = (object)idSede ?? DBNull.Value });
            command.Parameters.Add(new SqlParameter("@P_DNI", SqlDbType.VarChar, 20) { Value = (object)(dni ?? string.Empty) });
            command.Parameters.Add(new SqlParameter("@P_FECHA_INICIO", SqlDbType.Date) { Value = (object)fechaInicio ?? DBNull.Value });
            command.Parameters.Add(new SqlParameter("@P_FECHA_FIN", SqlDbType.Date) { Value = (object)fechaFin ?? DBNull.Value });
            command.Parameters.Add(new SqlParameter("@P_IDPARAMEVENTO", SqlDbType.Int) { Value = (object)idParamEvento ?? DBNull.Value });
            command.Parameters.Add(new SqlParameter("@P_PAGENUMBER", SqlDbType.Int) { Value = pageNumber });
            command.Parameters.Add(new SqlParameter("@P_PAGESIZE", SqlDbType.Int) { Value = pageSize });
            command.Parameters.Add(new SqlParameter("@P_TOTALROWS", SqlDbType.Int) { Direction = ParameterDirection.Output });
            sqlConnection.Open();

            List<AsistenciaListadoRow> items;
            using (SqlDataReader dataReader = command.ExecuteReader())
            {
                items = dataReader.GetEntities<AsistenciaListadoRow>();
            }
            int totalRows = command.Parameters["@P_TOTALROWS"].Value == DBNull.Value ? 0 : Convert.ToInt32(command.Parameters["@P_TOTALROWS"].Value);
            return (items, totalRows);
        }

        public List<AsistenciaListadoRow> ObtenerParaExportar(
            int idEmpresa,
            int? idSede,
            string dni,
            DateTime? fechaInicio,
            DateTime? fechaFin,
            int? idParamEvento)
        {
            using SqlConnection sqlConnection = new(cadenaConexion);
            using SqlCommand command = new($"{esquemaDB2}.MAC_SELECT_ASISTENCIAS_EXPORT", sqlConnection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.Add(new SqlParameter("@IdEmpresa", SqlDbType.Int) { Value = idEmpresa });
            command.Parameters.Add(new SqlParameter("@IdSede", SqlDbType.Int) { Value = (object)idSede ?? DBNull.Value });
            command.Parameters.Add(new SqlParameter("@P_DNI", SqlDbType.VarChar, 20) { Value = (object)(dni ?? string.Empty) });
            command.Parameters.Add(new SqlParameter("@P_FECHA_INICIO", SqlDbType.Date) { Value = (object)fechaInicio ?? DBNull.Value });
            command.Parameters.Add(new SqlParameter("@P_FECHA_FIN", SqlDbType.Date) { Value = (object)fechaFin ?? DBNull.Value });
            command.Parameters.Add(new SqlParameter("@P_IDPARAMEVENTO", SqlDbType.Int) { Value = (object)idParamEvento ?? DBNull.Value });
            sqlConnection.Open();
            using SqlDataReader dataReader = command.ExecuteReader();
            return dataReader.GetEntities<AsistenciaListadoRow>();
        }

        public int RegistrarManual(int idEmpresa, int? idSede, string dni, int idParamEvento, string observacion)
        {
            using SqlConnection sqlConnection = new(cadenaConexion);
            using SqlCommand command = new($"{esquemaDB2}.MAC_INSERT_ASISTENCIA_MANUAL", sqlConnection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.Add(new SqlParameter("@IdEmpresa", SqlDbType.Int) { Value = idEmpresa });
            command.Parameters.Add(new SqlParameter("@IdSede", SqlDbType.Int) { Value = (object)idSede ?? DBNull.Value });
            command.Parameters.Add(new SqlParameter("@DNI", SqlDbType.VarChar, 20) { Value = (object)(dni ?? string.Empty) });
            command.Parameters.Add(new SqlParameter("@IdParamEvento", SqlDbType.Int) { Value = idParamEvento });
            command.Parameters.Add(new SqlParameter("@Observacion", SqlDbType.VarChar, 200) { Value = (object)observacion ?? DBNull.Value });
            command.Parameters.Add(new SqlParameter("@IdAsistencia", SqlDbType.Int) { Direction = ParameterDirection.Output });
            sqlConnection.Open();
            command.ExecuteNonQuery();
            return command.Parameters["@IdAsistencia"].Value == DBNull.Value ? 0 : Convert.ToInt32(command.Parameters["@IdAsistencia"].Value);
        }
    }
}
