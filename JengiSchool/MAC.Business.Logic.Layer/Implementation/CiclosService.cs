using AutoMapper;
using MAC.Business.Entity.Layer.Entities;
using MAC.Business.Logic.Layer.Interfaces;
using MAC.Data.Access.Layer.Interfaces;
using MAC.DTO;
using MAC.DTO.Dtos;
using System;
using System.Net;

namespace MAC.Business.Logic.Layer.Implementation
{
    public class CiclosService : ICiclosService
    {
        private readonly ICiclosRepository _ciclosRepository;
        private readonly IMapper _mapper;

        public CiclosService(ICiclosRepository ciclosRepository, IMapper mapper)
        {
            _ciclosRepository = ciclosRepository;
            _mapper = mapper;
        }

        public Result<CicloPaginadoDto> ObtenerCiclosPaginado(int? idEmpresa, int? idSede, string nombre, int pageNumber, int pageSize)
        {
            Result<CicloPaginadoDto> result = new();
            if (pageNumber <= 0 || pageSize <= 0)
            {
                return result.BadRequest("Parámetros inválidos.");
            }

            var (ciclos, totalRows) = _ciclosRepository.ObtenerCiclosPaginado(idEmpresa, idSede, nombre, pageNumber, pageSize);
            result.Status = HttpStatusCode.OK;
            result.Resultado = new CicloPaginadoDto
            {
                TotalRows = totalRows,
                Items = _mapper.Map<System.Collections.Generic.List<CicloDto>>(ciclos)
            };
            return result;
        }

        public Result<CicloDto> CrearCiclo(CicloDto request)
        {
            Result<CicloDto> result = new();
            if (!Validar(request, out string mensaje))
            {
                return result.BadRequest(mensaje);
            }

            Ciclo entity = _mapper.Map<Ciclo>(request);
            Ciclo created = _ciclosRepository.CrearCiclo(entity);
            result.Status = HttpStatusCode.OK;
            result.Resultado = _mapper.Map<CicloDto>(created);
            return result;
        }

        public Result<CicloDto> ActualizarCiclo(int idCiclo, CicloDto request)
        {
            Result<CicloDto> result = new();
            if (idCiclo <= 0)
            {
                return result.BadRequest("IdCiclo inválido.");
            }
            if (!Validar(request, out string mensaje))
            {
                return result.BadRequest(mensaje);
            }

            Ciclo entity = _mapper.Map<Ciclo>(request);
            entity.IdCiclo = idCiclo;
            bool ok = _ciclosRepository.ActualizarCiclo(entity);
            if (!ok)
            {
                return result.NotFound("No se encontró el ciclo para actualizar.");
            }

            result.Status = HttpStatusCode.OK;
            result.Resultado = _mapper.Map<CicloDto>(entity);
            return result;
        }

        public Result<bool> EliminarCiclo(int idCiclo)
        {
            Result<bool> result = new();
            if (idCiclo <= 0)
            {
                return result.BadRequest("IdCiclo inválido.");
            }
            bool ok = _ciclosRepository.EliminarCiclo(idCiclo);
            if (!ok)
            {
                return result.NotFound("No se encontró el ciclo para eliminar.");
            }
            result.Status = HttpStatusCode.OK;
            result.Resultado = true;
            return result;
        }

        private static bool Validar(CicloDto request, out string mensaje)
        {
            mensaje = string.Empty;
            if (request == null)
            {
                mensaje = "Datos requeridos.";
                return false;
            }
            if (string.IsNullOrWhiteSpace(request.Nombre))
            {
                mensaje = "Nombre del ciclo requerido.";
                return false;
            }
            if (request.Nombre.Trim().Length > 50)
            {
                mensaje = "Nombre no puede exceder 50 caracteres.";
                return false;
            }
            if (request.IdSede <= 0)
            {
                mensaje = "Sede requerida.";
                return false;
            }
            if (request.FechaInicio.HasValue && request.FechaFin.HasValue && request.FechaFin.Value < request.FechaInicio.Value)
            {
                mensaje = "La fecha fin no puede ser anterior a la fecha inicio.";
                return false;
            }
            return true;
        }
    }
}
