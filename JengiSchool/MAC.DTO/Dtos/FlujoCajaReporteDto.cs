using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAC.DTO.Dtos
{
    public class FlujoCajaReporteDto
    {
        public int IdFlujoCaja { get; set; }
        public string NumeroCredito { get; set; }
        public decimal NumeroSolicitud { get; set; }
        public string DNITitular { get; set; }
        public string DNIConyuge { get; set; }
        public string Plataforma { get; set; }
        public string Ubigeo { get; set; }
        public decimal MontoDesembolso { get; set; }
        public decimal Plazo { get; set; }
        public decimal Tasa { get; set; }
        public string Destino { get; set; }
        public decimal FechaRegistroFC { get; set; }
        public decimal FechaFinalizacionFC { get; set; }
        public string CodigoProducto { get; set; }
        public string DescripcionProducto { get; set; }
        public decimal CodigoHP { get; set; }
        public string UnidadRendimientoEsperado { get; set; }
        public decimal RendimientoEsperado { get; set; }
        public decimal CostoProduccion { get; set; }
        public decimal PrecioMinimoEsperado { get; set; }
        public decimal PlazoMaximo { get; set; }

        public decimal TotalActivo { get; set; }
        public decimal ActivoCorriente { get; set; }
        public decimal Efectivo { get; set; }
        public decimal Bancos { get; set; }
        public decimal ActivoNoCorriente { get; set; }
        public decimal PasivoNoCorriente { get; set; }
        public decimal Patrimonio { get; set; }

        public decimal VentasNetas { get; set; }
        public decimal CostoVentas { get; set; }
        public decimal UtilidadBruta { get; set; }
        public decimal UtilidadOperativa { get; set; }
        public decimal UtilidadNeta { get; set; }
        public decimal ExcedenteNetoDelEjercicio { get; set; }

        public decimal TotalGastoMensual { get; set; }

        public decimal Liquidez { get; set; }
        public decimal EndeudamientoPatrimonial { get; set; }

        public decimal IngresosAgropecuarios { get; set; }
        public decimal EgresosAgropecuarios { get; set; }
        public decimal FlujoOtrasActividades { get; set; }
        public decimal GastosUnidadFamiliar { get; set; }
        public decimal EgresosFinancieros { get; set; }

        public decimal DeudasPotencialesDirectas { get; set; }
        public decimal ConsumoConUsoA { get; set; }
        public decimal ConsumoSinUsoB { get; set; }
        public decimal LCMicroEmpresaC { get; set; }
        public decimal LCPequenaEmpresaD { get; set; }

        public decimal DeudasPotencialesIndirectas { get; set; }
        public decimal AvalMypeA { get; set; }
        public decimal AvalConsumoB { get; set; }
        public decimal CartaFianzaC { get; set; }
        public string CalificacionAvalMype { get; set; }
        public string CalificacionAvalConsumo { get; set; }
        public string CalificacionCartaFianza { get; set; }

        public decimal ExcedenteFinalUltimoValorMes { get; set; }
        public decimal NumeroEntidades { get; set; }
        public string ResultadoCriterioNumeroEntidades { get; set; }
        public decimal RatioCP { get; set; }
        public string ResultadoCriterioRatioCP { get; set; }

        public decimal TCA { get; set; }
        public decimal TSCF { get; set; }
        public decimal TDP { get; set; }
        public decimal TEXTD { get; set; }

        public string TipoCliente { get; set; }
        public string Comportamiento { get; set; }
        public decimal DeudaSistemaFinanciero { get; set; }
        public string Resultado { get; set; }
        public string Condicion { get; set; }

        public decimal VARRendimiento { get; set; }
        public decimal VARPrecio { get; set; }
        public decimal VARCosto { get; set; }
        public decimal PrecioPromedio { get; set; }
        public decimal RendimientoPromedio { get; set; }

        public string VersionMAC { get; set; }
    }

    public class FlujoCajaReporteAnexoDetallePasivoDto
    {
        public int IdFlujoCaja { get; set; }
        public decimal NumeroSolicitud { get; set; }
        public string TipoPasivo { get; set; } //ESFA
        public string NombreEntidad { get; set; }//ESFA
        public decimal Monto { get; set; }//ESFA
    }

    public class FlujoCajaReportePlanDesembolsoDto
    {
        public int IdFlujoCaja { get; set; }
        public decimal NumeroSolicitud { get; set; }
        public int NumeroDesembolso { get; set; }//FC
        public int MesDesembolso { get; set; }//FC
        public decimal Porcentaje { get; set; }//FC
    }

    public class FlujoCajaReporteDataDto
    {
        public List<FlujoCajaReporteDto> FlujoCajaReportes { get; set; } = 
            new List<FlujoCajaReporteDto>();
        public List<FlujoCajaReporteAnexoDetallePasivoDto> FlujoCajaReporteAnexoDetallePasivos { get; set; } = 
            new List<FlujoCajaReporteAnexoDetallePasivoDto>();
        public List<FlujoCajaReportePlanDesembolsoDto> FlujoCajaReportePlanDesembolsos { get; set; } = 
            new List<FlujoCajaReportePlanDesembolsoDto>();
        public List<FlujoCajaEraDto> FlujoCajaEra { get; set; } = 
            new List<FlujoCajaEraDto>();
        public List<FlujoCajaEsfaDto> FlujoCajaEsfa { get; set; } = 
            new List<FlujoCajaEsfaDto>();
        public List<FlujoCajaDetalleDto> FlujoCajaDetalle { get; set; } = 
            new List<FlujoCajaDetalleDto>();
        public List<FlujoCajaDpdDto> FlujoCajaDPD { get; set; } = 
            new List<FlujoCajaDpdDto>();
        public List<FlujoCajaDpiDto> FlujoCajaDPI { get; set; } = 
            new List<FlujoCajaDpiDto>();
        public List<FlujoCajaRseDto> FlujoCajaRse { get; set; } = 
            new List<FlujoCajaRseDto>();

        public List<FlujoCajaRatioDto> FlujoCajaRatio { get; set; } =
            new List<FlujoCajaRatioDto>();
    }
}
