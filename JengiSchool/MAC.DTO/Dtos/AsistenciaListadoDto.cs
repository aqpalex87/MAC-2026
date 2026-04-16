using System;

namespace MAC.DTO.Dtos
{
    public class AsistenciaListadoDto
    {
        public int IdAsistencia { get; set; }
        public int IdParamEvento { get; set; }
        public string Evento { get; set; }
        public DateTime? Fecha { get; set; }
        public string Hora { get; set; }
        public string Sede { get; set; }
        public string Ciclo { get; set; }
        public string DNI { get; set; }
        public string Apellidos { get; set; }
        public string Nombres { get; set; }
        public string Observacion { get; set; }
    }
}
