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
    public class CarnetRepository : ICarnetRepository
    {
        private readonly string cadenaConexion;
        private readonly string esquemaDB2;

        public CarnetRepository(DB2DataAccess db2Access)
        {
            cadenaConexion = db2Access.ObtConnectionStringSql();
            esquemaDB2 = db2Access.EsquemaDB2;
        }

        public (List<CarnetListadoRow> Items, int TotalRows) ObtenerListado(int idEmpresa, int? idSede, string filtro, int pageNumber, int pageSize)
        {
            using SqlConnection sqlConnection = new(cadenaConexion);
            using SqlCommand command = new($"{esquemaDB2}.MAC_SELECT_CARNET_LISTADO", sqlConnection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.Add(new SqlParameter("@IdEmpresa", SqlDbType.Int) { Value = idEmpresa });
            command.Parameters.Add(new SqlParameter("@IdSede", SqlDbType.Int) { Value = (object)idSede ?? DBNull.Value });
            command.Parameters.Add(new SqlParameter("@P_FILTRO", SqlDbType.VarChar, 200) { Value = (object)(filtro ?? string.Empty) });
            command.Parameters.Add(new SqlParameter("@P_PAGENUMBER", SqlDbType.Int) { Value = pageNumber });
            command.Parameters.Add(new SqlParameter("@P_PAGESIZE", SqlDbType.Int) { Value = pageSize });
            command.Parameters.Add(new SqlParameter("@P_TOTALROWS", SqlDbType.Int) { Direction = ParameterDirection.Output });
            sqlConnection.Open();

            List<CarnetListadoRow> items;
            using (SqlDataReader dataReader = command.ExecuteReader())
            {
                items = dataReader.GetEntities<CarnetListadoRow>();
            }
            int totalRows = command.Parameters["@P_TOTALROWS"].Value == DBNull.Value ? 0 : Convert.ToInt32(command.Parameters["@P_TOTALROWS"].Value);
            return (items, totalRows);
        }
    }
}
