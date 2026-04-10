using System.Collections.Generic;

namespace MAC.Business.Entity.Layer.Entities
{
    public class FlujoCajaAnterior
    {
        public decimal IdFC { get; set; }
        public decimal NroSolicitud { get; set; }
        public string NroDocumento { get; set; }
        public decimal PeriodoActual { get; set; }
        public string IdProductoFC { get; set; }
        public string Producto { get; set; }
        public List<FlujoCajaGuf> Guf { get; set; }
        public List<FlujoCajaRatio> Ratios { get; set; }
        public List<FlujoCajaEsfa> Esfa { get; set; }
        public List<FlujoCajaEra> Era { get; set; }
        public List<FlujoCajaDetalle> ItemsFcd { get; set; }
        public List<FlujoCajaOc> ItemsOc { get; set; }
    }
}
