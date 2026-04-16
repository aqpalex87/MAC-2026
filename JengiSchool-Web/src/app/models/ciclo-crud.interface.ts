export interface CicloCrud {
  idCiclo: number;
  nombre: string;
  fechaInicio?: string | null;
  fechaFin?: string | null;
  activo: boolean;
  idSede: number;
  nombreSede?: string;
  idEmpresa?: number;
  nombreEmpresa?: string;
}

export interface CicloPaginadoResponse {
  totalRows: number;
  items: CicloCrud[];
}
