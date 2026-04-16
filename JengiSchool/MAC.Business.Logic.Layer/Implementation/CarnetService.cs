using MAC.Business.Entity.Layer.Entities;
using MAC.Business.Logic.Layer.Interfaces;
using MAC.Data.Access.Layer.Interfaces;
using MAC.DTO;
using MAC.DTO.Dtos;
using System.Collections.Generic;
using System.Linq;
using System.Net;

namespace MAC.Business.Logic.Layer.Implementation
{
    public class CarnetService : ICarnetService
    {
        private readonly ICarnetRepository _carnetRepository;

        public CarnetService(ICarnetRepository carnetRepository)
        {
            _carnetRepository = carnetRepository;
        }

        public Result<CarnetListadoPaginadoDto> ObtenerListado(int idEmpresa, int? idSede, string filtro, int pageNumber, int pageSize)
        {
            Result<CarnetListadoPaginadoDto> result = new();
            if (idEmpresa <= 0)
            {
                return result.BadRequest("Empresa requerida.");
            }
            if (pageNumber <= 0 || pageSize <= 0)
            {
                return result.BadRequest("Parámetros de paginación inválidos.");
            }

            (List<CarnetListadoRow> rows, int total) = _carnetRepository.ObtenerListado(idEmpresa, idSede, filtro, pageNumber, pageSize);
            result.Status = HttpStatusCode.OK;
            result.Resultado = new CarnetListadoPaginadoDto
            {
                TotalRows = total,
                Items = rows.Select(Map).ToList()
            };
            return result;
        }

        private static CarnetListadoDto Map(CarnetListadoRow r)
        {
            return new CarnetListadoDto
            {
                IdCarnet = r.IdCarnet,
                IdAlumno = r.IdAlumno,
                DNI = r.DNI,
                Apellidos = r.Apellidos,
                Nombres = r.Nombres,
                CarreraPostula = r.CarreraPostula,
                NombreCiclo = r.NombreCiclo,
                FechaVencimiento = r.FechaVencimiento,
                FechaInscripcion = r.FechaInscripcion,
                FechaRegistro = r.FechaRegistro,
                NombreEmpresa = r.NombreEmpresa,
                NombreSede = r.NombreSede,
                WhatsApp = r.WhatsApp
            };
        }
    }
}
