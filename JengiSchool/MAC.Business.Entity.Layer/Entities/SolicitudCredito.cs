namespace MAC.Business.Entity.Layer.Entities
{
    public class SolicitudCredito
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
        public string CodUsuario { get; set; }
        public string Funcionario { get; set; }
        public string CodDestino { get; set; }
        public string Destino { get; set; }
        public string UbigeoDep { get; set; }
        public decimal CantidadFinanciar { get; set; }
        public decimal Plazo { get; set; }
        public string PlazoUnidad { get; set; }
        public decimal MontoSolicitado { get; set; }
        public decimal IdFlujoCaja { get; set; }
        public decimal CodHP { get; set; }
        public decimal HPCosto { get; set; }
        public decimal HPPrecio { get; set; }
        public decimal HPRendimiento { get; set; }
       
        public string EstadoFlujoCaja { get; set; }
        public string EstadoPropuesta { get; set; }
        public string EstadoCredito { get; set; }
    }
}
