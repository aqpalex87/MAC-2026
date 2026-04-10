namespace MAC.Business.Entity.Layer.Entities
{
    public class ItemFlujoCaja
    {
        public string CodItem { get; set; }
        public string Descripcion { get; set; }
        public string CodItemPadre { get; set; }
        public decimal Tasa { get; set; }
        public decimal MontoAnterior { get; set; }
        public decimal PeriodoActual { get; set; }
        public string Producto { get; set; }
    }
}
