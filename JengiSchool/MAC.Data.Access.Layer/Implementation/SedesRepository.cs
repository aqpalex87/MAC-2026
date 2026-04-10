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
    public class SedesRepository : ISedesRepository
    {
        private readonly string cadenaConexion = null;
        private readonly string esquemaDB2;

        public SedesRepository(DB2DataAccess db2Access)
        {
            cadenaConexion = db2Access.ObtConnectionStringSql();
            esquemaDB2 = db2Access.EsquemaDB2;
        }
        public List<Sedes> ObtenerSedes(int CodCliente)
        {
            using SqlConnection sqlConnection = new(cadenaConexion);
            using SqlCommand command = new($"{esquemaDB2}.MAC_SELECT_SEDES_POR_CLIENTE", sqlConnection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.Add(new SqlParameter("@IDCLIENTE", CodCliente));
            sqlConnection.Open();

            using SqlDataReader dataReader = command.ExecuteReader();
            var sedes = dataReader.GetEntities<Sedes>();
            return sedes;
        }
    }
}
