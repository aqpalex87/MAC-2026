export interface UniversidadDetalleCrud {
  idDetalle: number;
  idUniversidad: number;
  carreraNombre: string;
  puntajeMinimo?: number | null;
  puntajeMaximo?: number | null;
  anio?: number | null;
}

export interface UniversidadCrud {
  idUniversidad: number;
  idEmpresa: number;
  nombreEmpresa?: string;
  nombre: string;
  detalles: UniversidadDetalleCrud[];
}

export interface UniversidadPaginadoResponse {
  totalRows: number;
  items: UniversidadCrud[];
}

export interface UniversidadComboItem {
  idUniversidad: number;
  nombre: string;
  idEmpresa: number;
}
