using MAC.Business.Entity.Layer.Entities;
using MAC.Data.Access.Layer.DB2;
using MAC.Data.Access.Layer.Extensions;
using MAC.Data.Access.Layer.Interfaces;
using Microsoft.Data.SqlClient;
using System.Collections.Generic;
using System.Data;

namespace MAC.Data.Access.Layer.Implementation
{
    public class AuthRepository : IAuthRepository
    {
        private readonly string cadenaConexion;
        private readonly string esquemaDB2;

        public AuthRepository(DB2DataAccess db2Access)
        {
            cadenaConexion = db2Access.ObtConnectionStringSql();
            esquemaDB2 = db2Access.EsquemaDB2;
        }

        public UsuarioAuth ObtenerUsuario(string usuario)
        {
            using SqlConnection sqlConnection = new(cadenaConexion);
            using SqlCommand command = new($"{esquemaDB2}.MAC_SELECT_USUARIO_POR_LOGIN", sqlConnection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.Add(new SqlParameter("@Usuario", SqlDbType.VarChar, 50) { Value = usuario });
            sqlConnection.Open();
            using SqlDataReader dataReader = command.ExecuteReader();
            return dataReader.GetEntity<UsuarioAuth>();
        }

        public List<MenuRol> ObtenerMenusPorUsuario(string usuario)
        {
            using SqlConnection sqlConnection = new(cadenaConexion);
            using SqlCommand command = new($"{esquemaDB2}.MAC_SELECT_MENUS_POR_USUARIO", sqlConnection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.Add(new SqlParameter("@Usuario", SqlDbType.VarChar, 50) { Value = usuario });
            sqlConnection.Open();
            using SqlDataReader dataReader = command.ExecuteReader();
            return dataReader.GetEntities<MenuRol>();
        }
    }
}
