namespace MAC.Business.Entity.Layer.Entities
{
    public class ParametroDPI : Auditoria
    {
        public string IdParametroDPI { get; set; }
        public string CodigoVersion { get; set; }
        public string TipoAval { get; set; }
        public decimal FactorCalificacionNormal { get; set; }
        public decimal FactorCalificacionCPP { get; set; }
        public decimal FactorCalificacionDeficiente { get; set; }
        public decimal FactorCalificacionDudoso { get; set; }
        public decimal FactorCalificacionPerdida { get; set; }
        public decimal TEM { get; set; }
        public decimal TEA { get; set; }
        public decimal Plazo { get; set; }
        public string Comentario { get; set; }
    }
}
