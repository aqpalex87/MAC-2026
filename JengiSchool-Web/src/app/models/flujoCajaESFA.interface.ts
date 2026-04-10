export interface FlujoCajaESFAItem {
    codItem: string;
    descripcion: string;
    montoActual: number| null;
    montoAnterior: number;
    porcentajeAV: number;
    porcentajeAH: number;
    codItemPadre: string;
    ind?: number;
    flag?: number;
    descripcionTemp?: string;
    selectEntidadBancaria?:string;
    lastDescripcion?:string;
}

export interface FlujoCajaESFA {
    data: FlujoCajaESFAItem;
    children: FlujoCajaESFA[];
}

