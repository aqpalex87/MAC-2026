export interface FlujoCajaFC {
  idFlujoCaja: number;
  numeroSolicitud: number;
  tipoDocumento: string;
  numeroDocumento: string;
  nombres: string;
  estadoFlujoCaja: string;
  estadoCredito: string;
  funcionario: string;
  agencia: string;
  numeroCredito: string;
  modo?: string;
}

export interface SolicitudRevisarFCFiltro {
  idFlujoCaja: string;
  numeroSolicitud: string;
  numeroCredito: string;
  numeroDocumento: string;
  nombres: string;
  estadoFlujoCaja: string;
}
export interface ActualizarRevisarFC {
  idf:number;
  comment: string;
}
