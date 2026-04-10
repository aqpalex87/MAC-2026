namespace MAC.DTO.Dtos
{
    /// <summary>
    /// Representa Otros Cargos del FC.
    /// </summary>
    public class FlujoCajaOcDto
    {
        public string CodItem { get; set; }
        public string Descripcion { get; set; }
        public decimal Tasa { get; set; }
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
