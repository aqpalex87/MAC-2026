using System.Collections.Generic;

namespace MAC.DTO.Dtos
{
    public class UniversidadDetalleDto
    {
        public int IdDetalle { get; set; }
        public int IdUniversidad { get; set; }
        public string CarreraNombre { get; set; }
        public decimal? PuntajeMinimo { get; set; }
        public decimal? PuntajeMaximo { get; set; }
        public int? Anio { get; set; }
    }

    public class UniversidadDto
    {
        public int IdUniversidad { get; set; }
        public int IdEmpresa { get; set; }
        public string NombreEmpresa { get; set; }
        public string Nombre { get; set; }
        public List<UniversidadDetalleDto> Detalles { get; set; } = new();
    }

    public class UniversidadPaginadoDto
    {
        public int TotalRows { get; set; }
        public List<UniversidadDto> Items { get; set; } = new();
    }
}
