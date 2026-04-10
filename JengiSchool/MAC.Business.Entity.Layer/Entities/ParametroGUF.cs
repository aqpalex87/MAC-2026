namespace MAC.Business.Entity.Layer.Entities
{
    public class ParametroGUF : Auditoria
    {
        public decimal IdParametroGUF { get; set; }
        public string CodigoVersion { get; set; }
        public string NombreGUF { get; set; }
        public string Editable { get; set; }
        public string Estado { get; set; }
    }
}
