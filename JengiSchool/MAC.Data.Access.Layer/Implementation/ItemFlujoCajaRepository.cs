using MAC.Business.Entity.Layer.Entities;
using MAC.Data.Access.Layer.DB2;
using MAC.Data.Access.Layer.Extensions;
using MAC.Data.Access.Layer.Interfaces;
using MAC.DTO.Dtos;
using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;

namespace MAC.Data.Access.Layer.Implementation
{
    public class ItemFlujoCajaRepository : IItemFlujoCajaRepository
    {
        private readonly string cadenaConexion;

        public ItemFlujoCajaRepository(DB2DataAccess db2Access)
        {
            cadenaConexion = db2Access.ObtConnectionStringSql();
        }

        public List<ItemFlujoCaja> ObtenerItemsFC(decimal idFC)
        {
            using SqlConnection sqlConnection = new(cadenaConexion);
            using SqlCommand command = new("UP_MAC_GET_ITEMS_FC", sqlConnection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.Add(new SqlParameter("P_IDFCLAST", SqlDbType.Decimal) { Value = idFC, Precision = 8 });
            sqlConnection.Open();
            using SqlDataReader dataReader = command.ExecuteReader();
            return dataReader.GetEntities<ItemFlujoCaja>();
        }

        public List<FlujoCajaGufDto> ObtenerItemsFCGUF(decimal idFC)
        {
            using SqlConnection sqlConnection = new(cadenaConexion);
            using SqlCommand command = new("UP_MAC_GET_ITEMS_FC_GUF", sqlConnection);
            command.Parameters.Add(new SqlParameter("P_IDFCLAST", SqlDbType.Decimal) { Value = idFC, Precision = 8 });
            command.CommandType = CommandType.StoredProcedure;
            sqlConnection.Open();
            using SqlDataReader dataReader = command.ExecuteReader();
            return dataReader.GetEntities<FlujoCajaGufDto>();
        }

        public List<FlujoCajaRatioDto> ObtenerItemsRatios(decimal idFC)
        {
            using SqlConnection sqlConnection = new(cadenaConexion);
            using SqlCommand command = new("UP_MAC_GET_ITEMS_FC_RATIOS", sqlConnection);
            command.Parameters.Add(new SqlParameter("P_ID_FLUJO_CAJA", SqlDbType.Decimal) { Value = idFC, Precision = 8 });
            command.CommandType = CommandType.StoredProcedure;
            sqlConnection.Open();
            using SqlDataReader dataReader = command.ExecuteReader();
            return dataReader.GetEntities<FlujoCajaRatioDto>();
        }

        public decimal ObtenerNewIdFC()
        {
            try
            {
                using SqlConnection sqlConnection = new(cadenaConexion);
                using SqlCommand command = new("UP_MAC_SEL_NEW_IDFC", sqlConnection);
                command.CommandType = CommandType.StoredProcedure;
                var parametros = new List<SqlParameter>
            {
                new SqlParameter("P_NEWIDFC", SqlDbType.Decimal) { Precision = 8, Direction = ParameterDirection.Output }
                };
                command.Parameters.AddRange(parametros.ToArray());
                sqlConnection.Open();
                command.ExecuteNonQuery();
                var idFC = (decimal)command.Parameters["P_NEWIDFC"].Value;
                return idFC;
            }
            catch (Exception ex)
            { throw ex; }
        }

    }
}
