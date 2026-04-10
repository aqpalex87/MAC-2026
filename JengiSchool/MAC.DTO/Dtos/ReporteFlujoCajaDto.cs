using MAC.DTO.Interfaces;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace MAC.DTO.Dtos
{
    public class ReporteFlujoCajaMasterDto
    {
        public decimal IdFC { get; set; }
        public decimal NumSolicitud { get; set; }
        public string NumDocumento { get; set; }
        public string CodVersionParametros { get; set; }
        public decimal PeriodoActual { get; set; }
        public decimal PeriodoAnterior { get; set; }
        public string IdProducto { get; set; }
        public decimal MontoFinanciamiento { get; set; }
        public string EstadoFC { get; set; }
        public decimal VersionActual { get; set; }
        public ReporteFlujoCajaDto ReporteFlujoCaja { get; set; }
        public List<ReporteItemFlujoCajaDto> ReporteItemsFlujoCaja { get; set; }
    }
    public class ReporteFlujoCajaDto
    {
        public decimal IdFC { get; set; }
        public decimal NumSolicitud { get; set; }
        public string TipoDocumento { get; set; }
        public string Nombres { get; set; }
        public string NumDocumento { get; set; }
        public string EstadoFC { get; set; }
        public string EstadoProuesta { get; set; }
        public string DescEstado { get; set; }
        public decimal CodAgencia { get; set; }
        public string DescAgencia { get; set; }
        public string CodFuncionario { get; set; }
        public string NomFuncionario { get; set; }
        public string Producto { get; set; }
        public string Destino { get; set; }
        public string DesDestino { get; set; }
        public string Departamento { get; set; }
        public decimal CantidadFinanciar { get; set; }
        public decimal Plazo { get; set; }
        public decimal MontoSol { get; set; }
        public decimal CodHP { get; set; }

        public List<ReporteFlujoCajaGufDto> Guf { get; set; }
        public List<ReporteFlujoCajaEsfaDto> Esfa { get; set; }
        public List<ReporteFlujoCajaEraDto> Era { get; set; }
        public List<ReporteFlujoCajaDetalleDto> FCDetalle { get; set; }
        public List<ReporteFlujoCajaDpdDto> DeudaPD { get; set; }
        public List<ReporteFlujoCajaDpiDto> DeudaPI { get; set; }
        public List<ReporteFlujoCajaRatioDto> Ratios { get; set; }
        public List<ReporteMontoPlazoDto> MontosPlazo { get; set; }
        public List<ReporteFlujoCajaObsDto> Comentarios { get; set; }
        public List<ReporteFLujoCajaRseDto> Rse { get; set; }//13
        public List<ReporteFLujoCajaMontosRseDto> MontosRse { get; set; }//14
        public List<ReporteFLujoCajaComportamientoDto> Comportamiento { get; set; }//15
        public List<ReporteFLujoCajaAlertasDto> Alertas { get; set; }//16
    }

    public class ReporteFLujoCajaRseDto
    {
        public Decimal NroEntidades { get; set; }
        public string TipoCliente { get; set; }
        public string Comportamiento { get; set; }
        public string Resultado { get; set; }
        public string Condicion { get; set; }
    }
    public class ReporteFLujoCajaMontosRseDto
    {
        public decimal IdFC { get; set; }
        public string CodItem { get; set; }
        public decimal Monto { get; set; }
        public string DescMonto { get; set; }
    }
    public class ReporteFLujoCajaAlertasDto
    {
        public string Nombre { get; set; }
    }
    public class ReporteFLujoCajaComportamientoDto
    {
        public string TipoComportamiento { get; set; }
        public string Descripcion { get; set; }
    }
    public class ReporteFlujoCajaRatioDto
    {
        public decimal IdFC { get; set; }
        public string CodVersion { get; set; }
        public string CodItem { get; set; }
        public string Nombre { get; set; }
        public string Regla { get; set; }
        public decimal ValorParametro { get; set; }
        public decimal Calculo { get; set; }
    }

    public class ReporteFlujoCajaDetalleDto
    {
        public decimal IdFC { get; set; }
        public string CodItem { get; set; }
        public string Descripcion { get; set; }
        public decimal CantidadUP { get; set; }
        public decimal ValorInicial { get; set; }
        public List<ReporteMontoPlazoDto> MontosPlazo { get; set; }
        public decimal ValorRestante { get; set; }
        public decimal Total { get; set; }
        public string CodItemPadre { get; set; }
    }

    public class ReporteFlujoCajaGufDto
    {
        public decimal IdFC { get; set; }
        public decimal IdParametroGasto { get; set; }
        public string DescParametro { get; set; }
        public decimal MontoActual { get; set; }
        public decimal MontoAnterior { get; set; }
    }

    //public class ReporteFlujoCajaRseDto
    //{
    //    public decimal NroEntidades { get; set; }
    //    public decimal RatioCP { get; set; }
    //    public decimal TotCuotasCredito { get; set; }
    //    public decimal TotCuotasDD { get; set; }
    //    public decimal TotDeudaPotenciales { get; set; }
    //    public decimal TotExcedentes { get; set; }
    //    public string TipoCliente { get; set; }
    //    public string Comportamiento { get; set; }
    //    public decimal DeudaSisFinanciero { get; set; }
    //    public string Resultado { get; set; }
    //    public string Condicion { get; set; }
    //}

    public class ReporteFlujoCajaEsfaDto
    {
        public decimal IdFC { get; set; }
        public string CodItem { get; set; }
        public string Descripcion { get; set; }
        public decimal MontoActual { get; set; }
        public decimal MontoAnterior { get; set; }
        public decimal PorcentajeAV { get; set; }
        public decimal PorcentajeAH { get; set; }
        public string CodItemPadre { get; set; }
    }

    public class ReporteFlujoCajaEraDto 
    {
        public decimal IdFC { get; set; }
        public string CodItem { get; set; }
        public string Descripcion { get; set; }
        public decimal MontoActual { get; set; }
        public decimal MontoAnterior { get; set; }
        public decimal PorcentajeAV { get; set; }
        public decimal PorcentajeAH { get; set; }
        public string CodItemPadre { get; set; }
    }

    public class ReporteMontoPlazoDto
    {
        public decimal IdFC { get; set; }
        public string CodItem { get; set; }
        public decimal Anio { get; set; }
        public decimal Mes { get; set; }
        public decimal Monto { get; set; }
        public decimal? Tasa { get; set; }
        public string Estado { get; set; }
    }

    public class ReporteFlujoCajaDpdDto
    {
        public string CodVersion { get; set; }
        public string CodItem { get; set; }
        public decimal FactorConversion { get; set; }
        public decimal Plazo { get; set; }
        public decimal Tem { get; set; }
        public decimal Tea { get; set; }
        public string Comentario { get; set; }
    }

    public class ReporteFlujoCajaDpiDto
    {
        public string CodVersion { get; set; }
        public string CodItem { get; set; }
        public decimal FactorConversionNor { get; set; }
        public decimal FactorConversionCPP { get; set; }
        public decimal FactorConversionDef { get; set; }
        public decimal FactorConversionDud { get; set; }
        public decimal FactorConversionPer { get; set; }
        public decimal Plazo { get; set; }
        public decimal Tem { get; set; }
        public decimal Tea { get; set; }
        public string Comentario { get; set; }
    }

    public class ReporteFlujoCajaObsDto
    {
        public decimal IdFC { get; set; }
        public string CodItem { get; set; }
        public string Comentario { get; set; }
    }

    public class ReporteItemFlujoCajaDto
    {
        public string Item { get; set; }
        public string CodItem { get; set; }
        public string Descripcion { get; set; }
        public string CodItemPadre { get; set; }

    }

}
