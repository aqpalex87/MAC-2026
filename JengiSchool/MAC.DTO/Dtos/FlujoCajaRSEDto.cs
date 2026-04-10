namespace MAC.DTO.Dtos
{
    /// <summary>
    /// Representa Riesgos y Sobreendeudamiento del FC.
    /// </summary>
    public class FlujoCajaRseDto
    {
        public int IdFlujoCaja { get; set; }
        public int NroEntidades { get; set; }
        public decimal RatioCP { get; set; }
        public decimal TotCuotasCredito { get; set; }
        public decimal TotCuotasDD { get; set; }
        public decimal TotDeudaPotenciales { get; set; }
        public decimal TotExcedentes { get; set; }
        public string TipoCliente { get; set; }
        public string Comportamiento { get; set; }
        public decimal DeudaSisFinanciero { get; set; }
        public string Resultado { get; set; }
        public string Condicion { get; set; }
    }
}
