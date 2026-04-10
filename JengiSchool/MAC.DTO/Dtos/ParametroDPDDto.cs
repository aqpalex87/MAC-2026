namespace MAC.DTO.Dtos
{
    public class ParametroDPDDto
    {
        public string IdParametroDPD { get; set; }
        public string CodigoVersion { get; set; }
        public string TipoTarjeta { get; set; }
        public decimal FactorConversion { get; set; }
        public decimal Plazo { get; set; }
        public decimal TEM { get; set; }
        public decimal TEA { get; set; }
        public string Comentario { get; set; }
    }
}
