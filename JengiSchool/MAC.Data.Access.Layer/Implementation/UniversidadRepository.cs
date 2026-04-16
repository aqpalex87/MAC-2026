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
    public class UniversidadRepository : IUniversidadRepository
    {
        private readonly string cadenaConexion;
        private readonly string esquemaDB2;

        public UniversidadRepository(DB2DataAccess db2Access)
        {
            cadenaConexion = db2Access.ObtConnectionStringSql();
            esquemaDB2 = db2Access.EsquemaDB2;
        }

        public (List<Universidad> Universidades, int TotalRows) ObtenerUniversidadesPaginado(int? idEmpresa, string nombre, int pageNumber, int pageSize)
        {
            using SqlConnection sqlConnection = new(cadenaConexion);
            using SqlCommand command = new($"{esquemaDB2}.MAC_SELECT_UNIVERSIDADES_PAGINADO", sqlConnection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.Add(new SqlParameter("@IdEmpresa", SqlDbType.Int) { Value = (object)idEmpresa ?? DBNull.Value });
            command.Parameters.Add(new SqlParameter("@P_NOMBRE", SqlDbType.VarChar, 150) { Value = (object)(nombre ?? string.Empty) });
            command.Parameters.Add(new SqlParameter("@P_PAGENUMBER", SqlDbType.Int) { Value = pageNumber });
            command.Parameters.Add(new SqlParameter("@P_PAGESIZE", SqlDbType.Int) { Value = pageSize });
            command.Parameters.Add(new SqlParameter("@P_TOTALROWS", SqlDbType.Int) { Direction = ParameterDirection.Output });
            sqlConnection.Open();

            List<Universidad> universidades;
            using (SqlDataReader dataReader = command.ExecuteReader())
            {
                universidades = dataReader.GetEntities<Universidad>();
            }
            int totalRows = command.Parameters["@P_TOTALROWS"].Value == DBNull.Value ? 0 : Convert.ToInt32(command.Parameters["@P_TOTALROWS"].Value);
            return (universidades, totalRows);
        }

        public List<UniversidadComboItem> ObtenerUniversidadesCombo(int? idEmpresa)
        {
            using SqlConnection sqlConnection = new(cadenaConexion);
            using SqlCommand command = new($"{esquemaDB2}.MAC_SELECT_UNIVERSIDADES_COMBO", sqlConnection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.Add(new SqlParameter("@IdEmpresa", SqlDbType.Int) { Value = (object)idEmpresa ?? DBNull.Value });
            sqlConnection.Open();
            using SqlDataReader dataReader = command.ExecuteReader();
            return dataReader.GetEntities<UniversidadComboItem>();
        }

        public List<UniversidadDetalle> ObtenerDetallePorUniversidad(int idUniversidad)
        {
            using SqlConnection sqlConnection = new(cadenaConexion);
            using SqlCommand command = new($"{esquemaDB2}.MAC_SELECT_UNIVERSIDAD_DETALLE", sqlConnection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.Add(new SqlParameter("@IdUniversidad", SqlDbType.Int) { Value = idUniversidad });
            sqlConnection.Open();
            using SqlDataReader dataReader = command.ExecuteReader();
            return dataReader.GetEntities<UniversidadDetalle>();
        }

        public Universidad CrearUniversidad(Universidad universidad)
        {
            using SqlConnection sqlConnection = new(cadenaConexion);
            using SqlCommand command = new($"{esquemaDB2}.MAC_INSERT_UNIVERSIDAD", sqlConnection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.Add(new SqlParameter("@IdEmpresa", SqlDbType.Int) { Value = universidad.IdEmpresa });
            command.Parameters.Add(new SqlParameter("@Nombre", SqlDbType.VarChar, 150) { Value = universidad.Nombre });
            command.Parameters.Add(new SqlParameter("@IdUniversidad", SqlDbType.Int) { Direction = ParameterDirection.Output });
            sqlConnection.Open();
            command.ExecuteNonQuery();
            universidad.IdUniversidad = command.Parameters["@IdUniversidad"].Value == DBNull.Value ? 0 : Convert.ToInt32(command.Parameters["@IdUniversidad"].Value);
            return universidad;
        }

        public bool ActualizarUniversidad(Universidad universidad)
        {
            using SqlConnection sqlConnection = new(cadenaConexion);
            using SqlCommand command = new($"{esquemaDB2}.MAC_UPDATE_UNIVERSIDAD", sqlConnection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.Add(new SqlParameter("@IdUniversidad", SqlDbType.Int) { Value = universidad.IdUniversidad });
            command.Parameters.Add(new SqlParameter("@IdEmpresa", SqlDbType.Int) { Value = universidad.IdEmpresa });
            command.Parameters.Add(new SqlParameter("@Nombre", SqlDbType.VarChar, 150) { Value = universidad.Nombre });
            sqlConnection.Open();
            return command.ExecuteNonQuery() > 0;
        }

        public bool EliminarUniversidad(int idUniversidad)
        {
            using SqlConnection sqlConnection = new(cadenaConexion);
            using SqlCommand command = new($"{esquemaDB2}.MAC_DELETE_UNIVERSIDAD", sqlConnection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.Add(new SqlParameter("@IdUniversidad", SqlDbType.Int) { Value = idUniversidad });
            sqlConnection.Open();
            return command.ExecuteNonQuery() > 0;
        }

        public bool GuardarDetalleUniversidad(int idUniversidad, string detalleXml)
        {
            using SqlConnection sqlConnection = new(cadenaConexion);
            using SqlCommand command = new($"{esquemaDB2}.MAC_SAVE_UNIVERSIDAD_DETALLE", sqlConnection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.Add(new SqlParameter("@IdUniversidad", SqlDbType.Int) { Value = idUniversidad });
            command.Parameters.Add(new SqlParameter("@DetalleXml", SqlDbType.Xml) { Value = (object)(detalleXml ?? "<root/>") });
            sqlConnection.Open();
            return command.ExecuteNonQuery() > 0;
        }
    }
}
