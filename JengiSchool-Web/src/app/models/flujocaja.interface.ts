import { TreeNode } from "primeng/api";
import { FlujoCajaESFA } from "./flujoCajaESFA.interface";

export interface FlujoCaja {
  idFC?: number;
  codDestino?: string;
  destino?: string;
  nroSolicitud?: number;
  nroDocumento?: string;
  cliente?: string;
  oficialNegocio?: string;
  agencia?: string;
  ubigeoDep?: string;
  codVerParametro?: string;
  comentarioGuf?: string;
  comentarioEsfa?: string;
  comentarioEra?: string;
  comentarioFcd?: string;
  comentarioRse?: string;
  comentarioDestinoInversion?: string;
  periodoActual?: number;
  periodoFC?: number;
  idProductoFC?: string;
  producto?: string;
  cantidadFinanciar?: number;
  plazo?: number;
  montoSolicitado?: number;
  hpCosto?: number;
  hpPrecio?: number;
  hpRendimiento?: number;
  svRendimiento?: number;
  svCosto?: number;
  svPrecio?: number;
  precioPromedio?: number;
  rendimientoPromedio?: number;
  montoTotalFinanciar?: number;
  guf?: any[];
  esfaTree?: FlujoCajaESFA[];
  eraTree?: TreeNode[];
  fcDetalleTree?: TreeNode[];
  deudaPD?: FlujoCajaDPD[];
  deudaPI?: FlujoCajaDPI[];
  planDR?: FlujoCajaPDR[];
  flujoCajaHP?: FlujoCajaHP[];
  otrosCargos?: FlujoCajaOC[];
  ratios?: FlujoCajaRatio[];
  rse?: Rse;
  hojaTrabajo?: FlujoCajaHT[];
  codEstado?: string;
  version?: number;

}


export interface FlujoCajaDeta {
  codItem: string;
  descripcion: string;
  cantidadUP: number;
  valorInicial: number;
  montosPlazo: MontoPlazo[];
  valorRestante: number;
  total: number;
  codItemPadre: string;
}

export interface MontoPlazo {
  anio: number;
  mes: number;
  monto: number;
}

export interface FlujoCajaDPD {
  idParametroDpd: string;
  montoDeuda: number | null;
}

export interface FlujoCajaDPI {
  idParametroDpi: string;
  calificacion: string;
  montoDeuda: number;
}

export interface FlujoCajaRatio {
  idParametroRatio: number;
  nombre: string;
  regla: string;
  valorParametro: number;
  resultado: number;
}

export interface FlujoCajaPDR {
  numero: number;
  mes: number | null;
  porcentaje: number | null;
}

export interface FlujoCajaOC {
  codItem: string;
  descripcion: string;
  tasa: number;
  monto: number | null;
}

export interface FlujoCajaHP {
  codItem: string;
  descripcion: string;
  monto: number | null;
}

export interface Rse {
  nroEntidades: number;
  ratioCP: number;
  totCuotasCredito: number;
  totCuotasDD: number;
  totDeudaPotenciales: number;
  totExcedentes: number;
  tipoCliente: string;
  comportamiento: string;
  deudaSisFinanciero: number;
  resultado: string;
  condicion: string;
}

export interface FlujoCajaHT {
  id: number;
  codigoLasefiche: number;
  comentario: string;
  idLaserfiche: number;
  estado: string;
  fechaRegistro: string;
  horaRegistro: string;
  usuarioRegistro: string;
  archivoBytes: any;
  extension: string;
  nombre: string;
}
export interface DeudaDirecta {
  id?: number;
  consumoCon?: number | null;
  consumoSin?: number | null;
  microEmpresa?: number | null;
  pequeEmpresa?: number | null;
  cuotaPotencialDirecta?: number;
  tarjetaLineasCredito?: string;
  factorConversion?: number;
  interesMensual?: number;
  numeroPlazo?: number;
}
export interface DeudaIndirecta {
  id?: number;
  avalMYPE?: number | null;
  avalConsumo?: number | null;
  CartaFianza?: number | null;
  avalMYPECombo?: number;
  avalConsumoCombo?: number;
  CartaFianzaCombo?: number;
  cuotaPotencialIndirecta?: number;
  interesMensual?: number;
  numeroPlazo?: number;
}

export interface FlujoCajaFiltro {
  numeroSolicitud: string;
  idFlujoCaja: string;
  numeroDocumento: string;
  nombres: string;
  numeroCredito: string;
  estadoFlujoCaja: string;
}

export interface CommonData {
  codDestino: string;
  gridTitle: string;
  textButton: string;
}

export enum DestinoCredito {
  SOSTENIMIENTO = '0001',
  INVERSION = '0002'
}

export interface FlujoCajaReporteFiltro {
  fechaInicio: Date;
  fechaFin: Date;
}

export interface Anio {
  code: string;
}