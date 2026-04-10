export interface ParametroDPDModal {
    idParametroDPD?: string;
    codigoVersion?: string;
    tipoTarjeta?: string;
    factorConversion?: number;
    plazo?: number;
    tEM?: number;
    tEA?: number;
    comentario?: string;
    valor: number | null;
}

export interface ParametroDPD {
    idParametroDPD: number;
    codigoVersion: string;
    tipoTarjeta: string;
    factorConversion: number;
    plazo: number;
    tEM: number;
    tEA: number;
    comentario: string;
}