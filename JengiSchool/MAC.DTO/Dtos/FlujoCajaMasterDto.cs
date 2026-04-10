using System.Collections.Generic;

namespace MAC.DTO.Dtos
{
    public class FlujoCajaAnteriorDto
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
        public string ComentarioGuf { get; set; }
        public string ComentarioEsfa { get; set; }
        public string ComentarioEra { get; set; }
        public string ComentarioFcd { get; set; }
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
        /// <summary>
        /// % Rendimiento
        /// </summary>
        public decimal SVRendimiento { get; set; }
        public decimal SVCosto { get; set; }
        public decimal SVPrecio { get; set; }
        public decimal PrecioPromedio { get; set; }
        public decimal RendimientoPromedio { get; set; }
        public decimal MontoTotalFinanciar { get; set; }
        public List<FlujoCajaGufDto> Guf { get; set; }
        //public List<FlujoCajaEsfaDto> Esfa { get; set; }
        public List<TreeNodeDto<FlujoCajaEsfaDto>> EsfaTree { get; set; }
        //public List<FlujoCajaEraDto> Era { get; set; }
        public List<TreeNodeDto<FlujoCajaEraDto>> EraTree { get; set; }

        //public List<FlujoCajaDetalleDto> FCDetalle { get; set; }
        public List<TreeNodeDto<FlujoCajaDetalleDto>> FCDetalleTree { get; set; }

        public List<FlujoCajaDpdDto> DeudaPD { get; set; }
        public List<FlujoCajaDpiDto> DeudaPI { get; set; }
        public List<FlujoCajaPdrDto> PlanDR { get; set; }
        public List<FlujoCajaOcDto> OtrosCargos { get; set; }
        public List<FlujoCajaRatioDto> Ratios { get; set; }
        public FlujoCajaRseDto Rse { get; set; }
        public List<FlujoCajaHtDto> HojaTrabajo { get; set; }
        public string CodEstado { get; set; }
        public decimal Version { get; set; }
    }
}
