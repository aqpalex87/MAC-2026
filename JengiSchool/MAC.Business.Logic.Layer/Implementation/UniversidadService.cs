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
    public class UniversidadService : IUniversidadService
    {
        private readonly IUniversidadRepository _universidadRepository;

        public UniversidadService(IUniversidadRepository universidadRepository)
        {
            _universidadRepository = universidadRepository;
        }

        public Result<UniversidadPaginadoDto> ObtenerUniversidadesPaginado(int? idEmpresa, string nombre, int pageNumber, int pageSize)
        {
            Result<UniversidadPaginadoDto> result = new();
            if (pageNumber <= 0 || pageSize <= 0)
            {
                return result.BadRequest("Parámetros inválidos.");
            }

            var (universidades, totalRows) = _universidadRepository.ObtenerUniversidadesPaginado(idEmpresa, nombre, pageNumber, pageSize);
            result.Status = HttpStatusCode.OK;
            result.Resultado = new UniversidadPaginadoDto
            {
                TotalRows = totalRows,
                Items = universidades.Select(MapToDto).ToList()
            };
            return result;
        }

        public Result<List<UniversidadDetalleDto>> ObtenerDetallePorUniversidad(int idUniversidad)
        {
            Result<List<UniversidadDetalleDto>> result = new();
            if (idUniversidad <= 0)
            {
                return result.BadRequest("IdUniversidad inválido.");
            }

            var detalle = _universidadRepository.ObtenerDetallePorUniversidad(idUniversidad)
                .Select(MapDetalleToDto)
                .ToList();
            result.Status = HttpStatusCode.OK;
            result.Resultado = detalle;
            return result;
        }

        public Result<UniversidadDto> CrearUniversidad(UniversidadDto request)
        {
            Result<UniversidadDto> result = new();
            if (!Validar(request, out string mensaje))
            {
                return result.BadRequest(mensaje);
            }

            var entity = MapToEntity(request);
            var created = _universidadRepository.CrearUniversidad(entity);
            bool detailSaved = _universidadRepository.GuardarDetalleUniversidad(created.IdUniversidad, BuildDetalleXml(request.Detalles));
            if (!detailSaved)
            {
                return result.BadRequest("No se pudo guardar el detalle de carreras.");
            }

            created.NombreEmpresa = request.NombreEmpresa;
            result.Status = HttpStatusCode.OK;
            result.Resultado = MapToDto(created);
            result.Resultado.Detalles = request.Detalles ?? new List<UniversidadDetalleDto>();
            return result;
        }

        public Result<UniversidadDto> ActualizarUniversidad(int idUniversidad, UniversidadDto request)
        {
            Result<UniversidadDto> result = new();
            if (idUniversidad <= 0)
            {
                return result.BadRequest("IdUniversidad inválido.");
            }
            if (!Validar(request, out string mensaje))
            {
                return result.BadRequest(mensaje);
            }

            var entity = MapToEntity(request);
            entity.IdUniversidad = idUniversidad;
            bool updated = _universidadRepository.ActualizarUniversidad(entity);
            if (!updated)
            {
                return result.NotFound("No se encontró la universidad.");
            }

            bool detailSaved = _universidadRepository.GuardarDetalleUniversidad(idUniversidad, BuildDetalleXml(request.Detalles));
            if (!detailSaved)
            {
                return result.BadRequest("No se pudo guardar el detalle de carreras.");
            }

            result.Status = HttpStatusCode.OK;
            result.Resultado = MapToDto(entity);
            result.Resultado.Detalles = request.Detalles ?? new List<UniversidadDetalleDto>();
            return result;
        }

        public Result<bool> EliminarUniversidad(int idUniversidad)
        {
            Result<bool> result = new();
            if (idUniversidad <= 0)
            {
                return result.BadRequest("IdUniversidad inválido.");
            }

            bool deleted = _universidadRepository.EliminarUniversidad(idUniversidad);
            if (!deleted)
            {
                return result.NotFound("No se encontró la universidad para eliminar.");
            }
            result.Status = HttpStatusCode.OK;
            result.Resultado = true;
            return result;
        }

        private static bool Validar(UniversidadDto request, out string mensaje)
        {
            mensaje = string.Empty;
            if (request == null)
            {
                mensaje = "Datos requeridos.";
                return false;
            }
            if (request.IdEmpresa <= 0)
            {
                mensaje = "Empresa requerida.";
                return false;
            }
            if (string.IsNullOrWhiteSpace(request.Nombre))
            {
                mensaje = "Nombre de universidad requerido.";
                return false;
            }
            if (request.Detalles == null || request.Detalles.Count == 0)
            {
                mensaje = "Debe registrar al menos una carrera.";
                return false;
            }
            if (request.Detalles.Any(x => string.IsNullOrWhiteSpace(x.CarreraNombre)))
            {
                mensaje = "Todas las carreras deben tener nombre.";
                return false;
            }
            return true;
        }

        private static UniversidadDto MapToDto(Universidad item)
        {
            return new UniversidadDto
            {
                IdUniversidad = item.IdUniversidad,
                IdEmpresa = item.IdEmpresa,
                NombreEmpresa = item.NombreEmpresa,
                Nombre = item.Nombre
            };
        }

        private static UniversidadDetalleDto MapDetalleToDto(UniversidadDetalle item)
        {
            return new UniversidadDetalleDto
            {
                IdDetalle = item.IdDetalle,
                IdUniversidad = item.IdUniversidad,
                CarreraNombre = item.CarreraNombre,
                PuntajeMinimo = item.PuntajeMinimo,
                PuntajeMaximo = item.PuntajeMaximo,
                Anio = item.Anio
            };
        }

        private static Universidad MapToEntity(UniversidadDto item)
        {
            return new Universidad
            {
                IdUniversidad = item.IdUniversidad,
                IdEmpresa = item.IdEmpresa,
                NombreEmpresa = item.NombreEmpresa,
                Nombre = item.Nombre?.Trim()
            };
        }

        private static string BuildDetalleXml(List<UniversidadDetalleDto> detalles)
        {
            StringBuilder sb = new();
            sb.Append("<root>");
            foreach (var d in detalles ?? new List<UniversidadDetalleDto>())
            {
                string carrera = SecurityElement.Escape((d.CarreraNombre ?? string.Empty).Trim());
                string min = d.PuntajeMinimo.HasValue ? d.PuntajeMinimo.Value.ToString(System.Globalization.CultureInfo.InvariantCulture) : string.Empty;
                string max = d.PuntajeMaximo.HasValue ? d.PuntajeMaximo.Value.ToString(System.Globalization.CultureInfo.InvariantCulture) : string.Empty;
                string anio = d.Anio.HasValue ? d.Anio.Value.ToString() : string.Empty;
                sb.Append("<d>");
                sb.Append($"<CarreraNombre>{carrera}</CarreraNombre>");
                sb.Append($"<PuntajeMinimo>{min}</PuntajeMinimo>");
                sb.Append($"<PuntajeMaximo>{max}</PuntajeMaximo>");
                sb.Append($"<Anio>{anio}</Anio>");
                sb.Append("</d>");
            }
            sb.Append("</root>");
            return sb.ToString();
        }
    }
}
