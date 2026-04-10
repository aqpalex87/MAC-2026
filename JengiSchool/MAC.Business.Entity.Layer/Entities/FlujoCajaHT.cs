namespace MAC.Business.Entity.Layer.Entities
{
    /// <summary>
    /// Representa la Hoja de Trabajo del Flujo de Caja.
    /// </summary>
    public class FlujoCajaHt
    {
        public string Comentario { get; set; }
        public decimal IdLaserfiche { get; set; }
        public decimal CodigoLaserfiche { get; set; }
        public string? FechaRegistro { get; set; }
        public string? HoraRegistro { get; set; }
        public string? UsuarioRegistro { get; set; }
        public string? Estado { get; set; }
    }
}
