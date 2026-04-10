export interface FlujoCajaMasterRequestDto {
    idFC?: number;
    codDestino: string;
    nroSolicitud: number;
    nroDocumento: string;
    codVerParametro: string;
    comentarioGuf: string;
    comentarioEsfa: string;
    comentarioEra: string;
    comentarioFcd: string;
    comentarioRse: string;
    comentarioDestinoInversion: string;
    periodoActual: number;
    periodoFC: number;
    idProductoFC: string;
    codEstado: string;
    sVRendimiento: number;
    sVCosto: number;
    sVPrecio: number;
    precioPromedio: number;
    rendimientoPromedio: number;
    montoTotalFinanciar: number;
    guf: FlujoCajaGufDto[];
    esfa: FlujoCajaEsfaDto[];
    era: FlujoCajaEraDto[];
    fCDetalle: FlujoCajaDetalleDto[];
    deudaPD: FlujoCajaDpdDto[];
    deudaPI: FlujoCajaDpiDto[];
    planDR: FlujoCajaPdrDto[];
    flujoCajaHP:FlujoCajaHPDto[];
    otrosCargos: FlujoCajaOcDto[];
    rse: FlujoCajaRseDto;
    hojaTrabajo?: FlujoCajaHtDto[];

}

export interface FlujoCajaGufDto {
    IdParametroGasto: number;
    NomParametro: string;
    MontoActual: number;
    MontoAnterior: number;
}

export interface FlujoCajaEsfaDto {
    codItem: string;
    descripcion: string;
    montoActual: number;
    montoAnterior: number;
    porcentajeAV: number;
    porcentajeAH: number;
    codItemPadre: string;
}

export interface FlujoCajaEraDto {
    codItem: string;
    descripcion: string;
    montoActual: number;
    montoAnterior: number;
    porcentajeAV: number;
    porcentajeAH: number;
    codItemPadre: string;

}

export interface FlujoCajaDetalleDto {
    codItem: string;
    descripcion: string;
    cantidadUP: number;
    valorInicial: number;
    montosPlazo: MontosPlazoDto[];
    valorRestante: number;
    total: number;
    codItemPadre: string;
}

export interface MontosPlazoDto {
    anio: number;
    mes: number;
    monto: number;
}

export interface FlujoCajaDpdDto {
    idParametroDpd: string;
    montoDeuda: number;
}

export interface FlujoCajaDpiDto {
    idParametroDpi: string;
    calificacion: string;
    montoDeuda: number;
}

export interface FlujoCajaPdrDto {
    numero: number;
    mes: number;
    porcentaje: number;
}

export interface FlujoCajaOcDto {
    codItem: string;
    descripcion: string;
    tasa: number;
    monto: number;
}

export interface FlujoCajaHPDto{
    codItem: string;
    descripcion: string;
    monto: number;
}

export interface FlujoCajaRseDto {
    nroEntidades: number;
    ratioCP: number;
    totCuotasCredito: number;
    totCuotasDD: number;
    totDeudaPotenciales: number;
    totExcedentes: number;
    tipoCliente: string;
    comportamiento: string;
    deudaSisFinanciero: number;
    resultado: string;
    condicion: string;
}

export interface FlujoCajaHtDto {
    comentario: string;
    idLaserFiche?: number;
}