using MAC.Business.Entity.Layer.Entities;
using MAC.Business.Logic.Layer.Interfaces;
using MAC.Data.Access.Layer.Interfaces;
using MAC.DTO;
using MAC.DTO.Dtos;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security;
using System.Text;

namespace MAC.Business.Logic.Layer.Implementation
{
    public class AlumnoService : IAlumnoService
    {
        private readonly IAlumnoRepository _alumnoRepository;
        private readonly IUniversidadRepository _universidadRepository;

        public AlumnoService(IAlumnoRepository alumnoRepository, IUniversidadRepository universidadRepository)
        {
            _alumnoRepository = alumnoRepository;
            _universidadRepository = universidadRepository;
        }

        public Result<AlumnoPaginadoDto> ObtenerAlumnosPaginado(int? idEmpresa, int? idSede, string filtro, int pageNumber, int pageSize)
        {
            Result<AlumnoPaginadoDto> result = new();
            if (pageNumber <= 0 || pageSize <= 0)
            {
                return result.BadRequest("Parámetros inválidos.");
            }

            var (alumnos, totalRows) = _alumnoRepository.ObtenerAlumnosPaginado(idEmpresa, idSede, filtro, pageNumber, pageSize);
            result.Status = HttpStatusCode.OK;
            result.Resultado = new AlumnoPaginadoDto
            {
                TotalRows = totalRows,
                Items = alumnos.Select(MapToDtoSinApoderados).ToList()
            };
            return result;
        }

        public Result<AlumnoDto> ObtenerAlumnoPorId(int idAlumno)
        {
            Result<AlumnoDto> result = new();
            if (idAlumno <= 0)
            {
                return result.BadRequest("IdAlumno inválido.");
            }

            Alumno entity = _alumnoRepository.ObtenerAlumnoPorId(idAlumno);
            if (entity == null || entity.IdAlumno <= 0)
            {
                return result.NotFound("No se encontró el alumno.");
            }

            AlumnoDto dto = MapToDtoSinApoderados(entity);
            dto.Apoderados = _alumnoRepository.ObtenerApoderadosPorAlumno(idAlumno)
                .Select(MapApoderadoToDto)
                .ToList();
            result.Status = HttpStatusCode.OK;
            result.Resultado = dto;
            return result;
        }

        public Result<AlumnoDto> CrearAlumno(AlumnoDto request)
        {
            Result<AlumnoDto> result = new();
            if (!Validar(request, out string mensaje))
            {
                return result.BadRequest(mensaje);
            }
            if (!ValidarCarreraPerteneceAUniversidad(request.IdUniversidad, request.IdUniversidadDetalle, out mensaje))
            {
                return result.BadRequest(mensaje);
            }
            if (!ValidarApoderados(request.Apoderados, out mensaje))
            {
                return result.BadRequest(mensaje);
            }

            Alumno entity = MapToEntity(request);
            Alumno created = _alumnoRepository.CrearAlumno(entity);
            _alumnoRepository.GuardarApoderadosAlumno(created.IdAlumno, BuildApoderadosXml(request.Apoderados));

            result.Status = HttpStatusCode.OK;
            result.Resultado = ObtenerAlumnoPorId(created.IdAlumno).Resultado;
            return result;
        }

        public Result<AlumnoDto> ActualizarAlumno(int idAlumno, AlumnoDto request)
        {
            Result<AlumnoDto> result = new();
            if (idAlumno <= 0)
            {
                return result.BadRequest("IdAlumno inválido.");
            }
            if (!Validar(request, out string mensaje))
            {
                return result.BadRequest(mensaje);
            }
            if (!ValidarCarreraPerteneceAUniversidad(request.IdUniversidad, request.IdUniversidadDetalle, out mensaje))
            {
                return result.BadRequest(mensaje);
            }
            if (!ValidarApoderados(request.Apoderados, out mensaje))
            {
                return result.BadRequest(mensaje);
            }

            Alumno entity = MapToEntity(request);
            entity.IdAlumno = idAlumno;
            bool ok = _alumnoRepository.ActualizarAlumno(entity);
            if (!ok)
            {
                return result.NotFound("No se encontró el alumno para actualizar.");
            }

            _alumnoRepository.GuardarApoderadosAlumno(idAlumno, BuildApoderadosXml(request.Apoderados));

            result.Status = HttpStatusCode.OK;
            result.Resultado = ObtenerAlumnoPorId(idAlumno).Resultado;
            return result;
        }

        public Result<bool> EliminarAlumno(int idAlumno)
        {
            Result<bool> result = new();
            if (idAlumno <= 0)
            {
                return result.BadRequest("IdAlumno inválido.");
            }
            bool ok = _alumnoRepository.EliminarAlumno(idAlumno);
            if (!ok)
            {
                return result.NotFound("No se encontró el alumno para eliminar.");
            }
            result.Status = HttpStatusCode.OK;
            result.Resultado = true;
            return result;
        }

        private bool ValidarCarreraPerteneceAUniversidad(int idUniversidad, int idUniversidadDetalle, out string mensaje)
        {
            mensaje = string.Empty;
            var detalles = _universidadRepository.ObtenerDetallePorUniversidad(idUniversidad);
            if (!detalles.Any(x => x.IdDetalle == idUniversidadDetalle))
            {
                mensaje = "La carrera seleccionada no pertenece a la universidad indicada.";
                return false;
            }
            return true;
        }

        private static bool Validar(AlumnoDto request, out string mensaje)
        {
            mensaje = string.Empty;
            if (request == null)
            {
                mensaje = "Datos requeridos.";
                return false;
            }
            if (string.IsNullOrWhiteSpace(request.Nombres))
            {
                mensaje = "Nombres requeridos.";
                return false;
            }
            if (string.IsNullOrWhiteSpace(request.Apellidos))
            {
                mensaje = "Apellidos requeridos.";
                return false;
            }
            if (request.IdSede <= 0)
            {
                mensaje = "Sede requerida.";
                return false;
            }
            if (request.IdUniversidad <= 0)
            {
                mensaje = "Universidad requerida.";
                return false;
            }
            if (request.IdUniversidadDetalle <= 0)
            {
                mensaje = "Carrera (detalle) requerida.";
                return false;
            }
            return true;
        }

        private static bool ValidarApoderados(List<AlumnoApoderadoDto> apoderados, out string mensaje)
        {
            mensaje = string.Empty;
            if (apoderados == null || apoderados.Count == 0)
            {
                return true;
            }
            foreach (AlumnoApoderadoDto a in apoderados)
            {
                if (string.IsNullOrWhiteSpace(a.Nombre))
                {
                    mensaje = "Cada apoderado debe tener nombre.";
                    return false;
                }
                if (a.IdParamParentesco <= 0)
                {
                    mensaje = "Cada apoderado debe tener parentesco.";
                    return false;
                }
            }
            return true;
        }

        private static AlumnoDto MapToDtoSinApoderados(Alumno a)
        {
            return new AlumnoDto
            {
                IdAlumno = a.IdAlumno,
                DNI = a.DNI,
                Apellidos = a.Apellidos,
                Nombres = a.Nombres,
                IdParamSexo = a.IdParamSexo,
                Dia = a.Dia,
                Mes = a.Mes,
                Anio = a.Anio,
                CarreraPostula = a.CarreraPostula,
                WhatsApp = a.WhatsApp,
                IeProcedencia = a.IeProcedencia,
                IeUbigeo = a.IeUbigeo,
                IdSede = a.IdSede,
                IdUniversidad = a.IdUniversidad,
                IdUniversidadDetalle = a.IdUniversidadDetalle,
                NombreSede = a.NombreSede,
                IdEmpresa = a.IdEmpresa,
                NombreEmpresa = a.NombreEmpresa,
                NombreUniversidad = a.NombreUniversidad,
                NombreCarreraDetalle = a.NombreCarreraDetalle
            };
        }

        private static AlumnoApoderadoDto MapApoderadoToDto(AlumnoApoderadoRow r)
        {
            return new AlumnoApoderadoDto
            {
                IdApoderado = r.IdApoderado,
                DNI = r.DNI,
                Nombre = r.Nombre,
                WhatsApp = r.WhatsApp,
                IdParamParentesco = r.IdParamParentesco,
                NombreParentesco = r.NombreParentesco
            };
        }

        private static Alumno MapToEntity(AlumnoDto d)
        {
            return new Alumno
            {
                IdAlumno = d.IdAlumno,
                DNI = d.DNI?.Trim(),
                Apellidos = d.Apellidos?.Trim(),
                Nombres = d.Nombres?.Trim(),
                IdParamSexo = d.IdParamSexo is > 0 ? d.IdParamSexo : null,
                Dia = d.Dia,
                Mes = d.Mes,
                Anio = d.Anio,
                CarreraPostula = d.CarreraPostula?.Trim(),
                WhatsApp = d.WhatsApp?.Trim(),
                IeProcedencia = d.IeProcedencia?.Trim(),
                IeUbigeo = d.IeUbigeo?.Trim(),
                IdSede = d.IdSede,
                IdUniversidad = d.IdUniversidad,
                IdUniversidadDetalle = d.IdUniversidadDetalle
            };
        }

        private static string BuildApoderadosXml(List<AlumnoApoderadoDto> apoderados)
        {
            StringBuilder sb = new();
            sb.Append("<root>");
            foreach (AlumnoApoderadoDto a in apoderados ?? new List<AlumnoApoderadoDto>())
            {
                int idAp = a.IdApoderado;
                string dni = SecurityElement.Escape((a.DNI ?? string.Empty).Trim());
                string nom = SecurityElement.Escape((a.Nombre ?? string.Empty).Trim());
                string wa = SecurityElement.Escape((a.WhatsApp ?? string.Empty).Trim());
                sb.Append("<a ");
                sb.Append("IdApoderado=\"").Append(idAp).Append("\" ");
                sb.Append("DNI=\"").Append(dni).Append("\" ");
                sb.Append("Nombre=\"").Append(nom).Append("\" ");
                sb.Append("WhatsApp=\"").Append(wa).Append("\" ");
                sb.Append("IdParamParentesco=\"").Append(a.IdParamParentesco).Append("\" ");
                sb.Append("/>");
            }
            sb.Append("</root>");
            return sb.ToString();
        }
    }
}
