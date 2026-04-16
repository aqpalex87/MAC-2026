using MAC.DTO;
using MAC.DTO.Dtos;

namespace MAC.Business.Logic.Layer.Interfaces
{
    public interface IAlumnoService
    {
        Result<AlumnoPaginadoDto> ObtenerAlumnosPaginado(int? idEmpresa, int? idSede, string filtro, int pageNumber, int pageSize);
        Result<AlumnoDto> ObtenerAlumnoPorId(int idAlumno);
        Result<AlumnoDto> CrearAlumno(AlumnoDto request);
        Result<AlumnoDto> ActualizarAlumno(int idAlumno, AlumnoDto request);
        Result<bool> EliminarAlumno(int idAlumno);
    }
}
