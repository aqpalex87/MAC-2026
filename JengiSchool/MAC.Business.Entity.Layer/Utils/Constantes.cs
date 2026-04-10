using System.Linq;

namespace MAC.Business.Entity.Layer.Utils
{
    public static class Policys
    {
        public const string Usuario = "Usuario";
    }

    public static class Limites
    {
        public const int MaxJsonLengthGUF = 5000;
        public const int MaxJsonLengthESFA = 10000;
        public const int MaxJsonLengthERA = 8000;
        public const int MaxJsonLengthFCD = 409600;
        public const int MaxJsonLengthPDR = 200;
        public const int MaxJsonLengthRSE = 500;
        public const int MaxJsonLengthHTB = 500;
        public const int MaxJsonLengthCOM = 2000;
        public const int MaxJsonLengthMOG = 409600;
    }

    public static class Perfiles
    {
        public const string USU = "USU";
    }

    public static class GrupoItem
    {
        public const string SENSIBILIZACION = "SEN";
        public const string COMENTARIO = "COM";
        public const string RSE = "RSE";
        public const string DEUDA_POTENCIAL_DIRECTA = "DPD";
        public const string DEUDA_POTENCIAL_INDIRECTA = "DPI";
        public const string OTROS_CARGOS = "OTC";
        public const string HOJA_PRODUCTO = "HP";
    }

    public static class Destino
    {
        public const string SOSTENIMIENTO = "0001";
    }

    public static class EstadoFC
    {
        public const int PENDIENTE = 1;
        public const int FINALIZADO = 2;
        public const int OBSERVADO = 3;
        public const int NO_FOUND = 0;
    }

    public static class EstadoSC
    {
        public static bool IsDesembolsado(string codEstado)
        {
            var estados = new[] { "**", "EN" };
            return estados.Contains(codEstado);
        }

    }
    public static class FlujoCajaMsg
    {
        public const string NO_ENCONTRADO = "Flujo de Caja no encontrado.";
        public const string FINALIZADO = "El FC ya se encuentra Finalizado.";
    }

    public static class Controller
    {
        public const string CONTROLLER_FILE = "file";
    }

    public static class Endpoints
    {
        public const string SAVE = "save";
        public const string GET_FILE_BYTES = "getFileBytes";
    }
    public static class RATIOSConstants
    {
        public const string Sobreendeudamiento = "1";
        public const string Liquidez = "2";
        public const string CapitalTrabajo = "3";
        public const string EndeudamientoPatrimonio = "4";
        public const string DeudaTotalActivos = "5";
        public const string RentabilidadSobreActivo = "6";
        public const string RentabilidadSobrePatrimonio = "7";
        public const string MargenVentas = "8";
    }

    public static class ERAConstants
    {
        public const string VentasNetas = "ERA001";
        public const string VentasNetas_Agricola = "ERA002";
        public const string VentasNetas_Pecuario = "ERA003";
        public const string CostosVentas = "ERA004";
        public const string CostosVentas_Agricola = "ERA005";
        public const string CostosVentas_Pecuario = "ERA006";
        public const string UtilidadBruta = "ERA007";
        public const string UtilidadBruta_OtrosGastosVentaAdministracion = "ERA008";
        public const string UtilidadOperativa = "ERA009";
        public const string UtilidadOperativa_GastosFinancieros_InteresCdts = "ERA010";
        public const string UtilidadOperativa_IngresosFinancieros = "ERA011";
        public const string UtilidadNeta = "ERA012";
        public const string UtilidadNeta_OtrosIngresos_NoAgropecuarios = "ERA013";
        public const string UtilidadNeta_GastosFamiliares = "ERA014";
        public const string ExcedenteNetoEjercicio = "ERA015";
    }

    public static class FlujoCajaConstants
    {
        public const string FlujoProyecto = "FCD001";
        public const string FlujoProyecto_IngresosAgropecuarios = "FCD002";
        public const string FlujoProyecto_EgresosAgropecuarios = "FCD003";
        public const string FlujoOtrasActividades = "FCD004";
        public const string FlujoOtrasActividades_Ingresos = "FCD005";
        public const string FlujoOtrasActividades_Egresos = "FCD006";
        public const string FlujoOtrasActividades_GUF = "FCD007";
        public const string EgresosFinancieros = "FCD008";
        public const string EgresosFinancieros_DeudaPotencialDirecta = "FCD009";
        public const string EgresosFinancieros_DeudaPotencialIndirecta = "FCD010";
        public const string ExcedenteMensual = "FCD011";
        public const string FlujoFinanciero = "FCD012";
        public const string FlujoFinanciero_DisponibleAporteSaldoCaja = "FCD013";
        public const string FlujoFinanciero_MontoCredito = "FCD014";
        public const string FlujoFinanciero_CuotasAmortizaciones = "FCD015";
        public const string ExcedenteFinal = "FCD016";

        public const string FlujoProyecto_IngresosAgropecuarios_ProductoSC = "FCD017";
        public const string FlujoProyecto_EgresosAgropecuarios_ProductoSC = "FCD018";
    }
    public static class ESFAConstants
    {
        public const string TotalActivo = "ESF001";
        public const string TotalActivo_ActivoCorriente = "ESF002";
        public const string ActivoCorriente_Efectivo = "ESF003";
        public const string ActivoCorriente_Bancos = "ESF004";
        public const string ActivoCorriente_ProductosProceso = "ESF005";
        public const string ActivoCorriente_ProductosTerminadosExistencias = "ESF006";
        public const string ActivoCorriente_Insumos = "ESF007";
        public const string ActivoCorriente_CuentasxCobrar = "ESF008";
        public const string ActivoCorriente_ActivosBiologicos = "ESF009";
        public const string ActivoCorriente_CuentasDiferidas = "ESF010";
        public const string TotalActivo_ActivoNoCorriente = "ESF011";
        public const string ActivoNoCorriente_Herramientas = "ESF012";
        public const string ActivoNoCorriente_MaquinariasEquipo = "ESF013";
        public const string ActivoNoCorriente_ActivosBiologicos = "ESF014";
        public const string ActivoNoCorriente_PredioUrbanoVivienda = "ESF015";
        public const string ActivoNoCorriente_PredioAgricola = "ESF016";
        public const string TotalActivo_PasivoCorriente = "ESF017";
        public const string PasivoCorriente_CtasxPagarComerciales = "ESF018";
        public const string TotalActivo_PasivoNoCorriente = "ESF019";
        public const string PasivoNoCorriente_CtasxPagarLargoPlazo = "ESF020";
        public const string TotalActivo_Patrimonio = "ESF021";
        public const string Patrimonio_Capital = "ESF022";
        public const string Patrimonio_ResultadoAcumulados = "ESF023";
        public const string Patrimonio_ResultadoEjercicio = "ESF024";
        public const string PasivoPatrimonio = "ESF025";
    }

}
