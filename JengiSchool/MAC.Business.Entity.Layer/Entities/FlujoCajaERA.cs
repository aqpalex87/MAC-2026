using MAC.Business.Entity.Layer.Interfaces;

namespace MAC.Business.Entity.Layer.Entities
{
    public class FlujoCajaEra : IFlujoCajaItem
    {
        public string CodItem { get; set; }
        public string Descripcion { get; set; }
        public decimal MontoActual { get; set; }
        public decimal MontoAnterior { get; set; }
        public decimal PorcentajeAV { get; set; }
        public decimal PorcentajeAH { get; set; }
        public string CodItemPadre { get; set; }
    }
}
