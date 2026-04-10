namespace MAC.Business.Entity.Layer.Entities
{
    public class ParametroAlerta : Auditoria
    {
        public decimal IdParametroAlerta { get; set; }
        public string CodigoVersion { get; set; }
        public string NombreAlerta { get; set; }
        public string Calculo { get; set; }
        public string Regla { get; set; }
        public decimal ValorParametro { get; set; }
        public string Comentario { get; set; }
        public string Estado { get; set; }
    }
}
