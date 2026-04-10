namespace MAC.Business.Entity.Layer.Entities
{
    /// <summary>
    /// Representa Otros Cargos del FC.
    /// </summary>
    public class FlujoCajaOc
    {
        public string CodItem { get; set; }
        public string Descripcion { get; set; }
        public decimal Tasa { get; set; }
        public decimal Monto { get; set; }
    }
}
