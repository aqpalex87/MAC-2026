export interface FlujoCajaDetalleItem {
    codItem: string;
    descripcion: string;
    montoActual: number;
    montoAnterior: number;
    porcentajeAV: number;
    porcentajeAH: number;
    codItemPadre: string;
    montosPlazo: MontoPlazo[];
    valorInicial: number;
}

export interface MontoPlazo {
    anio: number;
    mes: number;
    monto: number|null;
  }

export interface FlujoCajaDetalle {
    data: FlujoCajaDetalleItem;
    children: FlujoCajaDetalle[];
}

