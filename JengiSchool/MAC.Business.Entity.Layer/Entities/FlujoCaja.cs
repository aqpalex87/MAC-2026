namespace MAC.Business.Entity.Layer.Entities
{
    public class FlujoCaja
    {
        public decimal IdFlujoCaja { get; set; }
        public decimal NumeroSolicitud { get; set; }
        public string TipoDocumento { get; set; }
        public string NumeroDocumento { get; set; }
        public string Nombres { get; set; }
        public string EstadoFlujoCaja { get; set; }
        public string EstadoCredito { get; set; }
        public string Funcionario { get; set; }
        public string Agencia { get; set; }
        public decimal NumeroCredito { get; set; }
        public string CodDestino { get; set; }
        public decimal IdLaserfiche { get; set; }
    }
}
