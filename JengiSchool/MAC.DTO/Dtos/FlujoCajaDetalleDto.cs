using MAC.DTO.Interfaces;
using System.Collections.Generic;

namespace MAC.DTO.Dtos
{
    public class FlujoCajaDetalleDto : IFlujoCajaItemDto
    {
        public int IdFlujoCaja { get; set; }
        public string CodItem { get; set; }
        public string Descripcion { get; set; }
        public decimal CantidadUP { get; set; }

        private decimal? _valorInicial;
        public decimal? ValorInicial
        {
            get { return _valorInicial; }
            set
            {
                if (value == 0) _valorInicial = null;
                else _valorInicial = value;
            }
        }
        public decimal MontoAnterior { get; set; }
        public List<MontoPlazoDto> MontosPlazo { get; set; }

        private decimal? _valorRestante;
        public decimal? ValorRestante
        {
            get { return _valorRestante; }
            set
            {
                if (value == 0) _valorRestante = null;
                else _valorRestante = value;
            }
        }
        public decimal Total { get; set; }
        public string CodItemPadre { get; set; }
        public string DescripcionTemp { get; set; }
    }

    public class MontoPlazoDto
    {
        
        public decimal Anio { get; set; }
        public decimal Mes { get; set; }
        private decimal? _monto;
        public decimal? Monto
        {
            get { return _monto; }
            set
            {
                if (value == 0) _monto = null;
                else _monto = value;
            }
        }

    }


}
