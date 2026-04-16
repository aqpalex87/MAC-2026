export interface AlumnoApoderadoCrud {
  idApoderado: number;
  dni?: string | null;
  nombre: string;
  whatsApp?: string | null;
  idParamParentesco: number;
  nombreParentesco?: string | null;
}

export interface AlumnoCrud {
  idAlumno: number;
  dni?: string | null;
  apellidos: string;
  nombres: string;
  idParamSexo?: number | null;
  dia?: number | null;
  mes?: number | null;
  anio?: number | null;
  carreraPostula?: string | null;
  whatsApp?: string | null;
  ieProcedencia?: string | null;
  ieUbigeo?: string | null;
  idSede: number;
  idUniversidad: number;
  idUniversidadDetalle: number;
  nombreSede?: string;
  idEmpresa?: number;
  nombreEmpresa?: string;
  nombreUniversidad?: string;
  nombreCarreraDetalle?: string;
  apoderados: AlumnoApoderadoCrud[];
}

export interface AlumnoPaginadoResponse {
  totalRows: number;
  items: AlumnoCrud[];
}

export interface ParametroListaItem {
  idParametro: number;
  codigo: string;
  nombre: string;
  orden?: number | null;
}
