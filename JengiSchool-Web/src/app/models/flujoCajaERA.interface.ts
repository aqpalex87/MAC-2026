export interface FlujoCajaERAItem {
    codItem: string;
    descripcion: string;
    montoActual: number| null;
    montoAnterior: number;
    porcentajeAV: number;
    porcentajeAH: number;
    codItemPadre: string;
}

export interface FlujoCajaERA {
    data: FlujoCajaERAItem;
    children: FlujoCajaERA[];
}

