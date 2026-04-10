using System;

namespace MAC.Control.DTO
{
    public class AccessDto
    {
        public string CorreoElectronico { get; set; }
        public string NombreUsuario { get; set; }
        public string CodigoUsuario { get; set; }
        public string NumeroDocumento { get; set; }
        public DateTime FechaInicioVigencia { get; set; }
        public DateTime FechaFinVigencia { get; set; }
        public string Perfil { get; set; }
    }
}
