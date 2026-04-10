export interface Shared {
    montoGUF?: number;
    montoESFA?: number;
    isCompletedGUF: boolean;
    isCompletedESFA: boolean;
    isCompletedERA: boolean;
    isCompletedFC: boolean;
    isCompletedRSE: boolean;
    editableFC: boolean;
    comentarioGUF?: string;
}

export interface ParametroNuevo {
    modo: string;
    codigoVersionActivo: string;
    codigoVersionNuevo: string;
    activo: boolean;
    descripcion: string;
}

export interface Comentarios {
    comentarioGuf: string;
    comentarioEsfa: string;
    comentarioEra: string;
    comentarioFcd: string;
    comentarioRse: string;
}

export interface Sensibilizaciones {
    svRendimiento: number | null;
    svCosto: number | null;
    svPrecio: number | null;
    precioPromedio: number | null;
    rendimientoPromedio: number | null;
}