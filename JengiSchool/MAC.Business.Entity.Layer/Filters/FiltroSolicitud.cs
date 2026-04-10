using System;

namespace MAC.Business.Entity.Layer.Filters
{
    public class FiltroSolicitud
    {
        public string TipoSolicitud { get; set; }
        public string Situacion { get; set; }
        public string Nombre { get; set; }
        public string TipoDocumento { get; set; }
        public string NroDocumento { get; set; }
        public string NroPrestamo { get; set; }
        public DateTime? FechaSolicitudDesde { get; set; }
        public DateTime? FechaSolicitudHasta { get; set; }
        public DateTime? FechaProcesoDesde { get; set; }
        public DateTime? FechaProcesoHasta { get; set; }
        public decimal PageNumber { get; set; }
        public decimal PageSize { get; set; }

    }
}
