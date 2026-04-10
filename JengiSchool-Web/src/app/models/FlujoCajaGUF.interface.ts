export interface FlujoCajaGUF {
    idParametroGasto: number;
    nomParametro: string;
    montoActual: number| null;
    montoAnterior: number| null;
}

export interface FlujoCajaGUFResponse {
    itemsGUF: FlujoCajaGUF[];
}

