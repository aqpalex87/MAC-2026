namespace MAC.DTO.Dtos
{
    public class SolicitudCreditoDto
    {
        public string TipoDocumento { get; set; }
        public string NumeroDocumento { get; set; }
        public string Nombres { get; set; }
        public string TipoCliente { get; set; }
        public decimal NumeroSolicitud { get; set; }
        public string CodProducto { get; set; }
        public string Producto { get; set; }
        public string CodAgencia { get; set; }
        public string Agencia { get; set; }
        public string Funcionario { get; set; }
        public string CodDestino { get; set; }
        public string Destino { get; set; }
        public string UbigeoDep { get; set; }
        public decimal CantidadFinanciar { get; set; }
        public decimal Plazo { get; set; }
        public decimal MontoSolicitado { get; set; }
        public decimal IdFlujoCaja { get; set; }
        private decimal? _codHP;
        public decimal? CodHP
        {
            get { return _codHP; }
            set
            {
                if (value == 0) _codHP = null;
                else _codHP = value;
            }
        }
        private decimal? _hPCosto;
        public decimal? HPCosto
        {
            get { return _hPCosto; }
            set
            {
                if (value == 0) _hPCosto = null;
                else _hPCosto = value;
            }
        }
        private decimal? _hPPrecio;
        public decimal? HPPrecio
        {
            get { return _hPPrecio; }
            set
            {
                if (value == 0) _hPPrecio = null;
                else _hPPrecio = value;
            }
        }
        private decimal? _hPRendimiento;
        public decimal? HPRendimiento
        {
            get { return _hPRendimiento; }
            set
            {
                if (value == 0) _hPRendimiento = null;
                else _hPRendimiento = value;
            }
        }

        public string EstadoFlujoCaja { get; set; }
        public string EstadoPropuesta { get; set; }
        public string EstadoCredito { get; set; }
    }

    public class FilterSolicitudCreditoDto
    {
        public decimal IdFlujoCaja { get; set; }
        public decimal NumeroSolicitud { get; set; }
        public string NumeroDocumento { get; set; }
        public string Nombres { get; set; }
    }
}