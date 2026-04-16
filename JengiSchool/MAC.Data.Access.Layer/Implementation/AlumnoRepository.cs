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
    public class AlumnoRepository : IAlumnoRepository
    {
        private readonly string cadenaConexion;
        private readonly string esquemaDB2;

        public AlumnoRepository(DB2DataAccess db2Access)
        {
            cadenaConexion = db2Access.ObtConnectionStringSql();
            esquemaDB2 = db2Access.EsquemaDB2;
        }

        public (List<Alumno> Alumnos, int TotalRows) ObtenerAlumnosPaginado(int? idEmpresa, int? idSede, string filtro, int pageNumber, int pageSize)
        {
            using SqlConnection sqlConnection = new(cadenaConexion);
            using SqlCommand command = new($"{esquemaDB2}.MAC_SELECT_ALUMNOS_PAGINADO", sqlConnection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.Add(new SqlParameter("@IdEmpresa", SqlDbType.Int) { Value = (object)idEmpresa ?? DBNull.Value });
            command.Parameters.Add(new SqlParameter("@IdSede", SqlDbType.Int) { Value = (object)idSede ?? DBNull.Value });
            command.Parameters.Add(new SqlParameter("@P_FILTRO", SqlDbType.VarChar, 200) { Value = (object)(filtro ?? string.Empty) });
            command.Parameters.Add(new SqlParameter("@P_PAGENUMBER", SqlDbType.Int) { Value = pageNumber });
            command.Parameters.Add(new SqlParameter("@P_PAGESIZE", SqlDbType.Int) { Value = pageSize });
            command.Parameters.Add(new SqlParameter("@P_TOTALROWS", SqlDbType.Int) { Direction = ParameterDirection.Output });
            sqlConnection.Open();

            List<Alumno> alumnos;
            using (SqlDataReader dataReader = command.ExecuteReader())
            {
                alumnos = dataReader.GetEntities<Alumno>();
            }
            int totalRows = command.Parameters["@P_TOTALROWS"].Value == DBNull.Value ? 0 : Convert.ToInt32(command.Parameters["@P_TOTALROWS"].Value);
            return (alumnos, totalRows);
        }

        public Alumno ObtenerAlumnoPorId(int idAlumno)
        {
            using SqlConnection sqlConnection = new(cadenaConexion);
            using SqlCommand command = new($"{esquemaDB2}.MAC_SELECT_ALUMNO_POR_ID", sqlConnection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.Add(new SqlParameter("@IdAlumno", SqlDbType.Int) { Value = idAlumno });
            sqlConnection.Open();
            using SqlDataReader dataReader = command.ExecuteReader();
            return dataReader.GetEntity<Alumno>();
        }

        public List<AlumnoApoderadoRow> ObtenerApoderadosPorAlumno(int idAlumno)
        {
            using SqlConnection sqlConnection = new(cadenaConexion);
            using SqlCommand command = new($"{esquemaDB2}.MAC_SELECT_APODERADOS_POR_ALUMNO", sqlConnection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.Add(new SqlParameter("@IdAlumno", SqlDbType.Int) { Value = idAlumno });
            sqlConnection.Open();
            using SqlDataReader dataReader = command.ExecuteReader();
            return dataReader.GetEntities<AlumnoApoderadoRow>();
        }

        public Alumno CrearAlumno(Alumno alumno)
        {
            using SqlConnection sqlConnection = new(cadenaConexion);
            using SqlCommand command = new($"{esquemaDB2}.MAC_INSERT_ALUMNO", sqlConnection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.Add(new SqlParameter("@DNI", SqlDbType.VarChar, 15) { Value = (object)alumno.DNI ?? DBNull.Value });
            command.Parameters.Add(new SqlParameter("@Apellidos", SqlDbType.VarChar, 100) { Value = (object)alumno.Apellidos ?? DBNull.Value });
            command.Parameters.Add(new SqlParameter("@Nombres", SqlDbType.VarChar, 100) { Value = (object)alumno.Nombres ?? DBNull.Value });
            command.Parameters.Add(new SqlParameter("@IdParamSexo", SqlDbType.Int) { Value = (object)alumno.IdParamSexo ?? DBNull.Value });
            command.Parameters.Add(new SqlParameter("@Dia", SqlDbType.Int) { Value = (object)alumno.Dia ?? DBNull.Value });
            command.Parameters.Add(new SqlParameter("@Mes", SqlDbType.Int) { Value = (object)alumno.Mes ?? DBNull.Value });
            command.Parameters.Add(new SqlParameter("@Anio", SqlDbType.Int) { Value = (object)alumno.Anio ?? DBNull.Value });
            command.Parameters.Add(new SqlParameter("@CarreraPostula", SqlDbType.VarChar, 150) { Value = (object)alumno.CarreraPostula ?? DBNull.Value });
            command.Parameters.Add(new SqlParameter("@WhatsApp", SqlDbType.VarChar, 15) { Value = (object)alumno.WhatsApp ?? DBNull.Value });
            command.Parameters.Add(new SqlParameter("@IE_Procedencia", SqlDbType.VarChar, 150) { Value = (object)alumno.IeProcedencia ?? DBNull.Value });
            command.Parameters.Add(new SqlParameter("@IE_Ubigeo", SqlDbType.VarChar, 20) { Value = (object)alumno.IeUbigeo ?? DBNull.Value });
            command.Parameters.Add(new SqlParameter("@IdSede", SqlDbType.Int) { Value = alumno.IdSede });
            command.Parameters.Add(new SqlParameter("@IdUniversidad", SqlDbType.Int) { Value = alumno.IdUniversidad });
            command.Parameters.Add(new SqlParameter("@IdUniversidadDetalle", SqlDbType.Int) { Value = alumno.IdUniversidadDetalle });
            command.Parameters.Add(new SqlParameter("@IdCiclo", SqlDbType.Int) { Value = (object)alumno.IdCiclo ?? DBNull.Value });
            command.Parameters.Add(new SqlParameter("@IdAlumno", SqlDbType.Int) { Direction = ParameterDirection.Output });
            sqlConnection.Open();
            command.ExecuteNonQuery();
            alumno.IdAlumno = command.Parameters["@IdAlumno"].Value == DBNull.Value ? 0 : Convert.ToInt32(command.Parameters["@IdAlumno"].Value);
            return alumno;
        }

        public bool ActualizarAlumno(Alumno alumno)
        {
            using SqlConnection sqlConnection = new(cadenaConexion);
            using SqlCommand command = new($"{esquemaDB2}.MAC_UPDATE_ALUMNO", sqlConnection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.Add(new SqlParameter("@IdAlumno", SqlDbType.Int) { Value = alumno.IdAlumno });
            command.Parameters.Add(new SqlParameter("@DNI", SqlDbType.VarChar, 15) { Value = (object)alumno.DNI ?? DBNull.Value });
            command.Parameters.Add(new SqlParameter("@Apellidos", SqlDbType.VarChar, 100) { Value = (object)alumno.Apellidos ?? DBNull.Value });
            command.Parameters.Add(new SqlParameter("@Nombres", SqlDbType.VarChar, 100) { Value = (object)alumno.Nombres ?? DBNull.Value });
            command.Parameters.Add(new SqlParameter("@IdParamSexo", SqlDbType.Int) { Value = (object)alumno.IdParamSexo ?? DBNull.Value });
            command.Parameters.Add(new SqlParameter("@Dia", SqlDbType.Int) { Value = (object)alumno.Dia ?? DBNull.Value });
            command.Parameters.Add(new SqlParameter("@Mes", SqlDbType.Int) { Value = (object)alumno.Mes ?? DBNull.Value });
            command.Parameters.Add(new SqlParameter("@Anio", SqlDbType.Int) { Value = (object)alumno.Anio ?? DBNull.Value });
            command.Parameters.Add(new SqlParameter("@CarreraPostula", SqlDbType.VarChar, 150) { Value = (object)alumno.CarreraPostula ?? DBNull.Value });
            command.Parameters.Add(new SqlParameter("@WhatsApp", SqlDbType.VarChar, 15) { Value = (object)alumno.WhatsApp ?? DBNull.Value });
            command.Parameters.Add(new SqlParameter("@IE_Procedencia", SqlDbType.VarChar, 150) { Value = (object)alumno.IeProcedencia ?? DBNull.Value });
            command.Parameters.Add(new SqlParameter("@IE_Ubigeo", SqlDbType.VarChar, 20) { Value = (object)alumno.IeUbigeo ?? DBNull.Value });
            command.Parameters.Add(new SqlParameter("@IdSede", SqlDbType.Int) { Value = alumno.IdSede });
            command.Parameters.Add(new SqlParameter("@IdUniversidad", SqlDbType.Int) { Value = alumno.IdUniversidad });
            command.Parameters.Add(new SqlParameter("@IdUniversidadDetalle", SqlDbType.Int) { Value = alumno.IdUniversidadDetalle });
            command.Parameters.Add(new SqlParameter("@IdCiclo", SqlDbType.Int) { Value = (object)alumno.IdCiclo ?? DBNull.Value });
            sqlConnection.Open();
            return command.ExecuteNonQuery() > 0;
        }

        public bool EliminarAlumno(int idAlumno)
        {
            using SqlConnection sqlConnection = new(cadenaConexion);
            using SqlCommand command = new($"{esquemaDB2}.MAC_DELETE_ALUMNO", sqlConnection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.Add(new SqlParameter("@IdAlumno", SqlDbType.Int) { Value = idAlumno });
            sqlConnection.Open();
            return command.ExecuteNonQuery() > 0;
        }

        public bool GuardarApoderadosAlumno(int idAlumno, string apoderadosXml)
        {
            using SqlConnection sqlConnection = new(cadenaConexion);
            using SqlCommand command = new($"{esquemaDB2}.MAC_SAVE_APODERADOS_ALUMNO", sqlConnection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.Add(new SqlParameter("@IdAlumno", SqlDbType.Int) { Value = idAlumno });
            command.Parameters.Add(new SqlParameter("@ApoderadosXml", SqlDbType.Xml) { Value = (object)(apoderadosXml ?? "<root/>") });
            sqlConnection.Open();
            command.ExecuteNonQuery();
            return true;
        }
    }
}
