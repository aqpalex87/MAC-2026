using MAC.Business.Entity.Layer.Utils;

namespace MAC.Business.Entity.Layer.Entities
{
    /// <summary>
    /// Representa Riesgos y Sobreendeudamiento del FC.
    /// </summary>
    public class FlujoCajaRse
    {
        public decimal NroEntidades { get; set; }
        [Item("RSERCP")]
        public decimal RatioCP { get; set; }
        [Item("RSETCP")]
        public decimal TotCuotasCredito { get; set; }
        [Item("RSETCD")]
        public decimal TotCuotasDD { get; set; }
        [Item("RSETDP")]
        public decimal TotDeudaPotenciales { get; set; }
        [Item("RSETEP")]
        public decimal TotExcedentes { get; set; }
        public string TipoCliente { get; set; }
        public string Comportamiento { get; set; }
        [Item("RSEDSF")]
        public decimal DeudaSisFinanciero { get; set; }
        public string Resultado { get; set; }
        public string Condicion { get; set; }
    }
}
