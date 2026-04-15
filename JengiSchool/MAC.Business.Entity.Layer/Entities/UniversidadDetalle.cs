namespace MAC.Business.Entity.Layer.Entities
{
    public class UniversidadDetalle : Auditoria
    {
        public int IdDetalle { get; set; }
        public int IdUniversidad { get; set; }
        public string CarreraNombre { get; set; }
        public decimal? PuntajeMinimo { get; set; }
        public decimal? PuntajeMaximo { get; set; }
        public int? Anio { get; set; }
    }
}
