using MAC.Business.Entity.Layer.Entities;
using MAC.Data.Access.Layer.DB2;
using MAC.Data.Access.Layer.Extensions;
using MAC.Data.Access.Layer.Interfaces;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;

namespace MAC.Data.Access.Layer.Implementation
{
    public class HojaProductoRepository : IHojaProductoRepository
    {
        private readonly string cadenaConexion;
        public HojaProductoRepository(DB2DataAccess db2Access)
        {
            cadenaConexion = db2Access.ObtConnectionStringSql();
        }

        public List<HojaProducto> GetAllByUbigeoDep(string ubigeoDep)
        {
            using SqlConnection sqlConnection = new(cadenaConexion);
            using SqlCommand command = new("UP_MAC_SEL_HPS_POR_UBIGEO_DEP", sqlConnection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.Add(new SqlParameter("P_UBIGEODEP", SqlDbType.Char, 2) { Value = ubigeoDep });
            sqlConnection.Open();
            using SqlDataReader dataReader = command.ExecuteReader();
            var hojasProducto = dataReader.GetEntities<HojaProducto>();
            return hojasProducto;
        }


    }
}
