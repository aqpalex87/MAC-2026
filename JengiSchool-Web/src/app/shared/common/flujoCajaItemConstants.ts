export class FlujoCajaItemConstants {

    public static FlujoProyecto = "FCD001";
    public static FlujoProyecto_IngresosAgropecuarios = "FCD002";
    public static FlujoProyecto_EgresosAgropecuarios = "FCD003";
    public static FlujoOtrasActividades = "FCD004";
    public static FlujoOtrasActividades_Ingresos = "FCD005";
    public static FlujoOtrasActividades_Egresos = "FCD006";
    public static FlujoOtrasActividades_GUF = "FCD007";
    public static EgresosFinancieros = "FCD008";
    public static EgresosFinancieros_DeudaPotencialDirecta = "FCD009";
    public static EgresosFinancieros_DeudaPotencialIndirecta = "FCD010";
    public static ExcedenteMensual = "FCD011";
    public static FlujoFinanciero = "FCD012";
    public static FlujoFinanciero_DisponibleAporteSaldoCaja = "FCD013";
    public static FlujoFinanciero_MontoCredito = "FCD014";
    public static FlujoFinanciero_CuotasAmortizaciones = "FCD015";
    public static ExcedenteFinal = "FCD016";

    public static FlujoProyecto_IngresosAgropecuarios_ProductoSC = 'FCD017';
    public static FlujoProyecto_EgresosAgropecuarios_ProductoSC = 'FCD018';

    public static itemsNoEditablesESFA = [
        "ESF001",
        "ESF002",
        "ESF011",
        "ESF017",
        "ESF019",
        "ESF021",
        "ESF022",
        "ESF025"
    ];

    public static itemsNoEditablesFC = [
        "FCD001",
        "FCD004",
        "FCD009",
        "FCD010",
    ]

    public static itemsDinamicos = [
        "ESF017",
        "ESF019"
    ];

    public static itemsDinamicosFC = [
        "FCD002",
        "FCD005"
    ]

    public static itemsNoDinamicosFC = [
        "FCD001",
        "FCD003",
        "FCD004",
        "FCD006",
        "FCD007",
        "FCD008",
        "FCD009",
        "FCD010",
        "FCD011",
        "FCD012",
        "FCD013",
        "FCD014",
        "FCD015",
        "FCD016"
    ]

    public static itemsEstablecerValorPorPadreFC = [
        "FCD008"
    ]

    public static itemsEstablecerValorFC = [
        "FCD015"
    ]

    public static itemsIngresoEgresoFC = [
        "FCD017",
        "FCD018",
    ]

    public static itemsFlujoProyecto = [
        "FCD002",
        "FCD003"
    ]

    public static itemGufFC = ["FCD007"]

    public static itemsNoEditablesERA = [
        "ERA001",
        "ERA002",
        "ERA003",
        "ERA004",
        "ERA005",
        "ERA006",
        "ERA007",
        "ERA009",
        "ERA012",
        "ERA013",
        "ERA014",
        "ERA015"
    ]

    public static itemsDinamicosERA = [
        "ERA002",
        "ERA003",
        "ERA013"
    ]

    public static itemCeldaNoEditableFlujoFinancieroCuotasAmortizacionesFC = [
        "FCD015"
    ]

    public static itemCeldaNoEditableFlujoFinancieroMontoCreditoFC = [
        "FCD013"
    ]

    public static itemCeldaNoEditableFlujoFinancieroMontoCreditoValorRestanteFC = [
        "FCD014"
    ]

    public static itemCeldaNoEditableExcedenteMensualFC = [
        "FCD011"
    ]

    public static itemCeldaNoEditableExcedenteFinalFC = [
        "FCD016"
    ]
    
}