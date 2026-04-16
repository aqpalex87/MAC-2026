using MAC.Business.Entity.Layer.Entities;
using MAC.Business.Logic.Layer.Interfaces;
using MAC.Data.Access.Layer.Interfaces;
using MAC.DTO;
using MAC.DTO.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;

namespace MAC.Business.Logic.Layer.Implementation
{
    public class AsistenciaService : IAsistenciaService
    {
        private readonly IAsistenciaRepository _asistenciaRepository;

        public AsistenciaService(IAsistenciaRepository asistenciaRepository)
        {
            _asistenciaRepository = asistenciaRepository;
        }

        public Result<AsistenciaPaginadoDto> ObtenerPaginado(int idEmpresa, int? idSede, string dni, DateTime? fechaInicio, DateTime? fechaFin, int? idParamEvento, int pageNumber, int pageSize)
        {
            Result<AsistenciaPaginadoDto> result = new();
            if (idEmpresa <= 0)
            {
                return result.BadRequest("Empresa de sesión inválida.");
            }
            if (pageNumber <= 0 || pageSize <= 0)
            {
                return result.BadRequest("Parámetros de paginación inválidos.");
            }
            if (fechaInicio.HasValue && fechaFin.HasValue && fechaFin.Value.Date < fechaInicio.Value.Date)
            {
                return result.BadRequest("La fecha fin no puede ser menor que fecha inicio.");
            }

            (List<AsistenciaListadoRow> rows, int totalRows) = _asistenciaRepository.ObtenerPaginado(
                idEmpresa, idSede, dni, fechaInicio, fechaFin, idParamEvento, pageNumber, pageSize);

            result.Status = HttpStatusCode.OK;
            result.Resultado = new AsistenciaPaginadoDto
            {
                TotalRows = totalRows,
                Items = rows.Select(Map).ToList()
            };
            return result;
        }

        public Result<List<AsistenciaListadoDto>> ObtenerParaExportar(int idEmpresa, int? idSede, string dni, DateTime? fechaInicio, DateTime? fechaFin, int? idParamEvento)
        {
            Result<List<AsistenciaListadoDto>> result = new();
            if (idEmpresa <= 0)
            {
                return result.BadRequest("Empresa de sesión inválida.");
            }
            if (fechaInicio.HasValue && fechaFin.HasValue && fechaFin.Value.Date < fechaInicio.Value.Date)
            {
                return result.BadRequest("La fecha fin no puede ser menor que fecha inicio.");
            }

            var rows = _asistenciaRepository.ObtenerParaExportar(idEmpresa, idSede, dni, fechaInicio, fechaFin, idParamEvento);
            result.Status = HttpStatusCode.OK;
            result.Resultado = rows.Select(Map).ToList();
            return result;
        }

        public Result<AsistenciaRegistroRespuestaDto> RegistrarManual(int idEmpresa, int? idSede, AsistenciaRegistroManualDto request)
        {
            Result<AsistenciaRegistroRespuestaDto> result = new();
            if (idEmpresa <= 0)
            {
                return result.BadRequest("Empresa de sesión inválida.");
            }
            if (request == null)
            {
                return result.BadRequest("Datos requeridos.");
            }
            if (string.IsNullOrWhiteSpace(request.DNI))
            {
                return result.BadRequest("DNI requerido.");
            }
            if (request.IdParamEvento <= 0)
            {
                return result.BadRequest("Evento requerido.");
            }
            int idAsistencia;
            try
            {
                idAsistencia = _asistenciaRepository.RegistrarManual(
                    idEmpresa,
                    idSede,
                    request.DNI.Trim(),
                    request.IdParamEvento,
                    request.Observacion?.Trim());
            }
            catch (Exception ex)
            {
                return result.BadRequest(ex.Message);
            }

            if (idAsistencia <= 0)
            {
                return result.BadRequest("No se pudo registrar la asistencia.");
            }

            result.Status = HttpStatusCode.OK;
            result.Resultado = new AsistenciaRegistroRespuestaDto
            {
                IdAsistencia = idAsistencia,
                Registrado = true,
                Mensaje = "Asistencia registrada correctamente."
            };
            return result;
        }

        private static AsistenciaListadoDto Map(AsistenciaListadoRow x)
        {
            return new AsistenciaListadoDto
            {
                IdAsistencia = x.IdAsistencia,
                IdParamEvento = x.IdParamEvento,
                Evento = x.Evento,
                Fecha = x.Fecha,
                Hora = x.Hora,
                Sede = x.Sede,
                Ciclo = x.Ciclo,
                DNI = x.DNI,
                Apellidos = x.Apellidos,
                Nombres = x.Nombres,
                Observacion = x.Observacion
            };
        }
    }
}
