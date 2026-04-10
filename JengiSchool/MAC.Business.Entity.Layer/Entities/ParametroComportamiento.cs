namespace MAC.Business.Entity.Layer.Entities
{
    public class ParametroComportamiento : Auditoria
    {
        public decimal IdParametroComportamiento { get; set; }
        public string CodigoVersion { get; set; }
        public string TipoCliente { get; set; }
        public string DescripcionComportamiento { get; set; }
        public string Comentario { get; set; }
        public string Estado { get; set; } = "1";
    }
}
