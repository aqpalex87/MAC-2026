using MAC.Business.Entity.Layer.Entities;
using System.Collections.Generic;

namespace MAC.Data.Access.Layer.Interfaces
{
    public interface IAlumnoRepository
    {
        (List<Alumno> Alumnos, int TotalRows) ObtenerAlumnosPaginado(int? idEmpresa, int? idSede, string filtro, int pageNumber, int pageSize);
        Alumno ObtenerAlumnoPorId(int idAlumno);
        List<AlumnoApoderadoRow> ObtenerApoderadosPorAlumno(int idAlumno);
        Alumno CrearAlumno(Alumno alumno);
        bool ActualizarAlumno(Alumno alumno);
        bool EliminarAlumno(int idAlumno);
        bool GuardarApoderadosAlumno(int idAlumno, string apoderadosXml);
    }
}
