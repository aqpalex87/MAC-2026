export interface AsistenciaListadoItem {
  idAsistencia: number;
  idParamEvento: number;
  evento?: string | null;
  fecha?: string | null;
  hora?: string | null;
  sede?: string | null;
  ciclo?: string | null;
  dni?: string | null;
  apellidos?: string | null;
  nombres?: string | null;
  observacion?: string | null;
}

export interface AsistenciaPaginadoResponse {
  totalRows: number;
  items: AsistenciaListadoItem[];
}

export interface AsistenciaRegistroManualRequest {
  dni: string;
  idParamEvento: number;
  observacion?: string | null;
}

export interface AsistenciaRegistroManualResponse {
  idAsistencia: number;
  registrado: boolean;
  mensaje?: string | null;
}
