namespace MAC.Business.Entity.Layer.Entities
{
    public class ParametroRatio : Auditoria
    {
        public decimal IdParametroRatio { get; set; }
        public string CodigoVersion { get; set; }
        public string NombreRatio { get; set; }
        public string Regla { get; set; }
        public decimal ValorParametro { get; set; }
        public string Calculo { get; set; }
        public string Estado { get; set; }
    }
}
