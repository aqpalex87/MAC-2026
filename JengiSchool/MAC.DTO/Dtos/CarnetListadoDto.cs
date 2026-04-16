using System;

namespace MAC.DTO.Dtos
{
    public class CarnetListadoDto
    {
        public int? IdCarnet { get; set; }
        public int IdAlumno { get; set; }
        public string DNI { get; set; }
        public string Apellidos { get; set; }
        public string Nombres { get; set; }
        public string CarreraPostula { get; set; }
        public string NombreCiclo { get; set; }
        public DateTime? FechaVencimiento { get; set; }
        public DateTime? FechaInscripcion { get; set; }
        public DateTime? FechaRegistro { get; set; }
        public string NombreEmpresa { get; set; }
        public string NombreSede { get; set; }
        public string WhatsApp { get; set; }
    }
}
