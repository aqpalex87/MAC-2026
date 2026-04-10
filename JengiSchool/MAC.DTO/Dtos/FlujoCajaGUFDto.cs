namespace MAC.DTO.Dtos
{
    public class FlujoCajaGufDto
    {
        
        public decimal IdParametroGasto { get; set; }
        public string NomParametro { get; set; }

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
    }
}
