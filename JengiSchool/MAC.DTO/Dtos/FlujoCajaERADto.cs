using MAC.DTO.Interfaces;

namespace MAC.DTO.Dtos
{
    public class FlujoCajaEraDto : IFlujoCajaItemDto
    {
        public int IdFlujoCaja { get; set; }
        public string CodItem { get; set; }
        public string Descripcion { get; set; }
        private decimal? _montoActual;
        public decimal? MontoActual
        {
            get { return _montoActual; }
            set
            {
                if (value == 0) _montoActual = null;
                else _montoActual = value;
            }
        }
        public decimal MontoAnterior { get; set; }

        public decimal PorcentajeAV { get; set; }
        public decimal PorcentajeAH { get; set; }
        public string CodItemPadre { get; set; }
    }
}
