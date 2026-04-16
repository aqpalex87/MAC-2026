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
    public class CiclosRepository : ICiclosRepository
    {
        private readonly string cadenaConexion;
        private readonly string esquemaDB2;

        public CiclosRepository(DB2DataAccess db2Access)
        {
            cadenaConexion = db2Access.ObtConnectionStringSql();
            esquemaDB2 = db2Access.EsquemaDB2;
        }

        public (List<Ciclo> Ciclos, int TotalRows) ObtenerCiclosPaginado(int? idEmpresa, int? idSede, string nombre, int pageNumber, int pageSize)
        {
            using SqlConnection sqlConnection = new(cadenaConexion);
            using SqlCommand command = new($"{esquemaDB2}.MAC_SELECT_CICLOS_PAGINADO", sqlConnection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.Add(new SqlParameter("@IdEmpresa", SqlDbType.Int) { Value = (object)idEmpresa ?? DBNull.Value });
            command.Parameters.Add(new SqlParameter("@IdSede", SqlDbType.Int) { Value = (object)idSede ?? DBNull.Value });
            command.Parameters.Add(new SqlParameter("@P_NOMBRE", SqlDbType.VarChar, 50) { Value = (object)(nombre ?? string.Empty) });
            command.Parameters.Add(new SqlParameter("@P_PAGENUMBER", SqlDbType.Int) { Value = pageNumber });
            command.Parameters.Add(new SqlParameter("@P_PAGESIZE", SqlDbType.Int) { Value = pageSize });
            command.Parameters.Add(new SqlParameter("@P_TOTALROWS", SqlDbType.Int) { Direction = ParameterDirection.Output });
            sqlConnection.Open();

            List<Ciclo> ciclos;
            using (SqlDataReader dataReader = command.ExecuteReader())
            {
                ciclos = dataReader.GetEntities<Ciclo>();
            }
            int totalRows = command.Parameters["@P_TOTALROWS"].Value == DBNull.Value ? 0 : Convert.ToInt32(command.Parameters["@P_TOTALROWS"].Value);
            return (ciclos, totalRows);
        }

        public Ciclo CrearCiclo(Ciclo ciclo)
        {
            try
            {


                using SqlConnection sqlConnection = new(cadenaConexion);
                using SqlCommand command = new($"{esquemaDB2}.MAC_INSERT_CICLO", sqlConnection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.Add(new SqlParameter("@Nombre", SqlDbType.VarChar, 50) { Value = ciclo.Nombre });
                command.Parameters.Add(new SqlParameter("@FechaInicio", SqlDbType.Date) { Value = (object)ciclo.FechaInicio ?? DBNull.Value });
                command.Parameters.Add(new SqlParameter("@FechaFin", SqlDbType.Date) { Value = (object)ciclo.FechaFin ?? DBNull.Value });
                command.Parameters.Add(new SqlParameter("@Activo", SqlDbType.Bit) { Value = ciclo.Activo });
                command.Parameters.Add(new SqlParameter("@IdSede", SqlDbType.Int) { Value = ciclo.IdSede });
                command.Parameters.Add(new SqlParameter("@IdCiclo", SqlDbType.Int) { Direction = ParameterDirection.Output });
                sqlConnection.Open();
                command.ExecuteNonQuery();
                ciclo.IdCiclo = command.Parameters["@IdCiclo"].Value == DBNull.Value ? 0 : Convert.ToInt32(command.Parameters["@IdCiclo"].Value);
                return ciclo;
            }
            catch (Exception ex)
            { throw ex; }
        }

        public bool ActualizarCiclo(Ciclo ciclo)
        {
            using SqlConnection sqlConnection = new(cadenaConexion);
            using SqlCommand command = new($"{esquemaDB2}.MAC_UPDATE_CICLO", sqlConnection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.Add(new SqlParameter("@IdCiclo", SqlDbType.Int) { Value = ciclo.IdCiclo });
            command.Parameters.Add(new SqlParameter("@Nombre", SqlDbType.VarChar, 50) { Value = ciclo.Nombre });
            command.Parameters.Add(new SqlParameter("@FechaInicio", SqlDbType.Date) { Value = (object)ciclo.FechaInicio ?? DBNull.Value });
            command.Parameters.Add(new SqlParameter("@FechaFin", SqlDbType.Date) { Value = (object)ciclo.FechaFin ?? DBNull.Value });
            command.Parameters.Add(new SqlParameter("@Activo", SqlDbType.Bit) { Value = ciclo.Activo });
            command.Parameters.Add(new SqlParameter("@IdSede", SqlDbType.Int) { Value = ciclo.IdSede });
            sqlConnection.Open();
            return command.ExecuteNonQuery() > 0;
        }

        public bool EliminarCiclo(int idCiclo)
        {
            using SqlConnection sqlConnection = new(cadenaConexion);
            using SqlCommand command = new($"{esquemaDB2}.MAC_DELETE_CICLO", sqlConnection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.Add(new SqlParameter("@IdCiclo", SqlDbType.Int) { Value = idCiclo });
            sqlConnection.Open();
            return command.ExecuteNonQuery() > 0;
        }
    }
}
