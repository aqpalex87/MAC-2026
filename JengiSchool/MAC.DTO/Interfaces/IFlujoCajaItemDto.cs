namespace MAC.DTO.Interfaces
{
    public interface IFlujoCajaItemDto
    {
        public string CodItem { get; set; }
        public string Descripcion { get; set; }
        public string CodItemPadre { get; set; }
        public decimal MontoAnterior { get; set; }

    }
}
