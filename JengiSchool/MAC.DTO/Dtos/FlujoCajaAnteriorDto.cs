using System.Collections.Generic;

namespace MAC.DTO.Dtos
{
    public class FlujoCajaMasterDto
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
        /// 

        private decimal? _sVRendimiento;
        public decimal? SVRendimiento
        {
            get { return _sVRendimiento; }
            set
            {
                if (value == 0) _sVRendimiento = null;
                else _sVRendimiento = value;
            }
        }
        private decimal? _sVCosto;
        public decimal? SVCosto
        {
            get { return _sVCosto; }
            set
            {
                if (value == 0) _sVCosto = null;
                else _sVCosto = value;
            }
        }
        private decimal? _sVPrecio;
        public decimal? SVPrecio
        {
            get { return _sVPrecio; }
            set
            {
                if (value == 0) _sVPrecio = null;
                else _sVPrecio = value;
            }
        }
        private decimal? _precioPromedio;
        public decimal? PrecioPromedio
        {
            get { return _precioPromedio; }
            set
            {
                if (value == 0) _precioPromedio = null;
                else _precioPromedio = value;
            }
        }
        private decimal? _rendimientoPromedio;
        public decimal? RendimientoPromedio
        {
            get { return _rendimientoPromedio; }
            set
            {
                if (value == 0) _rendimientoPromedio = null;
                else _rendimientoPromedio = value;
            }
        }
        public decimal MontoTotalFinanciar { get; set; }
        public List<FlujoCajaGufDto> Guf { get; set; }
        public List<TreeNodeDto<FlujoCajaEsfaDto>> EsfaTree { get; set; }
        public List<TreeNodeDto<FlujoCajaEraDto>> EraTree { get; set; }
        public List<TreeNodeDto<FlujoCajaDetalleDto>> FCDetalleTree { get; set; }

        public List<FlujoCajaDpdDto> DeudaPD { get; set; }
        public List<FlujoCajaDpiDto> DeudaPI { get; set; }
        public List<FlujoCajaPdrDto> PlanDR { get; set; }
        public List<FlujoCajaOcDto> OtrosCargos { get; set; }
        public List<FlujoCajaHPDto> FlujoCajaHP { get; set; }
        public List<FlujoCajaRatioDto> Ratios { get; set; }
        public FlujoCajaRseDto Rse { get; set; }
        public List<FlujoCajaHtDto> HojaTrabajo { get; set; }
        public string CodEstado { get; set; }
        public decimal Version { get; set; }
    }
}
