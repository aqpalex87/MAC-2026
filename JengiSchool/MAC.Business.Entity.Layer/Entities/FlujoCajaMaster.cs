using MAC.Business.Entity.Layer.Utils;
using System.Collections.Generic;

namespace MAC.Business.Entity.Layer.Entities
{
    public class FlujoCajaMaster : Auditoria
    {
        public decimal IdFC { get; set; }
        public string CodDestino { get; set; }
        public string Destino { get; set; }
        public decimal NroSolicitud { get; set; }
        public string NroDocumento { get; set; }
        public string Cliente { get; set; }
        public string OficialNegocio { get; set; }
        public string Agencia { get; set; }
        public string UbigeoDep { get; set; }
        public string CodVerParametro { get; set; }
        [Item("COMGUF")]
        public string ComentarioGuf { get; set; }
        [Item("COMESF")]
        public string ComentarioEsfa { get; set; }
        [Item("COMERA")]
        public string ComentarioEra { get; set; }
        [Item("COMFCD")]
        public string ComentarioFcd { get; set; }
        [Item("COMRSE")]
        public string ComentarioRse { get; set; }
        public decimal PeriodoActual { get; set; }
        public decimal PeriodoFC { get; set; }
        public string IdProductoFC { get; set; }
        public string Producto { get; set; }
        public decimal CantidadFinanciar { get; set; }
        public decimal Plazo { get; set; }
        public decimal MontoSolicitado { get; set; }
        public decimal HPCosto { get; set; }
        public decimal HPPrecio { get; set; }
        public decimal HPRendimiento { get; set; }

        [Item("SENREN")]
        public decimal SVRendimiento { get; set; }
        [Item("SENCOS")]
        public decimal SVCosto { get; set; }
        [Item("SENPRE")]
        public decimal SVPrecio { get; set; }
        [Item("SENPRP")]
        public decimal PrecioPromedio { get; set; }
        [Item("SENRPR")]
        public decimal RendimientoPromedio { get; set; }
        public decimal MontoTotalFinanciar { get; set; }
        public List<FlujoCajaGuf> Guf { get; set; }
        public List<FlujoCajaEsfa> Esfa { get; set; }
        public List<FlujoCajaEra> Era { get; set; }
        public List<FlujoCajaDetalle> FCDetalle { get; set; }
        public List<FlujoCajaDpd> DeudaPD { get; set; }
        public List<FlujoCajaDpi> DeudaPI { get; set; }
        public List<FlujoCajaPdr> PlanDR { get; set; }
        public List<FlujoCajaOc> OtrosCargos { get; set; }
        public List<FlujoCajaHP> FlujoCajaHP { get; set; }
        public List<FlujoCajaRatio> Ratios { get; set; }
        public FlujoCajaRse Rse { get; set; }
        public List<FlujoCajaHt> HojaTrabajo { get; set; }
        public string CodEstado { get; set; }
        public decimal Version { get; set; }
        

    }
}
