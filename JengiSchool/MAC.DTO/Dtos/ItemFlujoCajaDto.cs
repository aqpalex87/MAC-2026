namespace MAC.DTO.Dtos
{
    public class ItemFlujoCajaDto
    {
        public string CodItem { get; set; }
        public string Descripcion { get; set; }
        public string CodItemPadre { get; set; }
        public decimal Tasa { get; set; }
        public decimal MontoAnterior { get; set; }

    }
}
