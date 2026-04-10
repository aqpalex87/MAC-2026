namespace MAC.Business.Entity.Layer.Entities
{
    public class ParametroTipoCliente : Auditoria
    {
        public decimal IdParametroTipoCliente { get; set; }
        public string CodigoVersion { get; set; }
        public string DescripcionTipoCliente { get; set; }
        public decimal ValorParametro { get; set; }
        public string Comentario { get; set; }
        public string Estado { get; set; } = "1";
    }
}
