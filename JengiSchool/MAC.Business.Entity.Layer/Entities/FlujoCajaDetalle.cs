using MAC.Business.Entity.Layer.Interfaces;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace MAC.Business.Entity.Layer.Entities
{
    public class FlujoCajaDetalle : IFlujoCajaItem
    {
        public string CodItem { get; set; }
        public string Descripcion { get; set; }
        public decimal Tasa { get; set; }
        public decimal CantidadUP { get; set; }
        public decimal ValorInicial { get; set; }
        public List<MontoPlazo> MontosPlazo { get; set; }
        public decimal ValorRestante { get; set; }
        public decimal Total { get; set; }
        public string CodItemPadre { get; set; }
        public string DescripcionTemp { get; set; }
    }

    public class MontoPlazo
    {
        public string CodItem { get; set; }
        public decimal Anio { get; set; }
        public decimal Mes { get; set; }
        public decimal Monto { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public decimal? Tasa { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string CodClas { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string Descripcion { get; set; }
    }
}
