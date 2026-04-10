namespace MAC.DTO.Dtos
{
    public class FlujoCajaPdrDto
    {
        public decimal Numero { get; set; }

        private decimal? _mes;
        public decimal? Mes
        {
            get { return _mes; }
            set
            {
                //if (value == 0) _mes = null;
                //else _mes = value;
                _mes = value;
            }
        }

        private decimal? _porcentaje;
        public decimal? Porcentaje
        {
            get { return _porcentaje; }
            set
            {
                if (value == 0) _porcentaje = null;
                else _porcentaje = value;
            }
        }
    }
}
