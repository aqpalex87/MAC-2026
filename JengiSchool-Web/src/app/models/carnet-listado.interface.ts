export interface CarnetListadoItem {
  idCarnet?: number | null;
  idAlumno: number;
  dni?: string | null;
  apellidos?: string | null;
  nombres?: string | null;
  carreraPostula?: string | null;
  nombreCiclo?: string | null;
  fechaVencimiento?: string | null;
  fechaInscripcion?: string | null;
  fechaRegistro?: string | null;
  nombreEmpresa?: string | null;
  nombreSede?: string | null;
  whatsApp?: string | null;
}

export interface CarnetListadoResponse {
  totalRows: number;
  items: CarnetListadoItem[];
}
