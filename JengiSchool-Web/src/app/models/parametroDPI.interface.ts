export interface ParametroDPIModal {
    idParametroDPI?: string;
    codigoVersion?: string;
    tipoAval?: string;
    factorCalificacionNormal?: number;
    factorCalificacionCPP?: number;
    factorCalificacionDeficiente?: number;
    factorCalificacionDudoso?: number;
    factorCalificacionPerdida?: number;
    tEM?: number;
    tEA?: number;
    plazo?: number;
    comentario?: string;
    valor?: number|null;
    factorConversion?: number;
    calificacion?: string;
}

export interface ParametroDPI {
    idParametroDPI: number;
    codigoVersion: string;
    tipoAval: string;
    factorCalificacionNormal: number;
    factorCalificacionCPP: number;
    factorCalificacionDeficiente: number;
    factorCalificacionDudoso: number;
    factorCalificacionPerdida: number;
    tEM: number;
    tEA: number;
    plazo: number;
    comentario: string;
}