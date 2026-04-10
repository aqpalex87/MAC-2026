export interface Solicitud {
    tipoDocumento?: string;
    numeroDocumento?: string;
    nombres?: string;
    tipoCliente?: string;
    numeroSolicitud?: number;
    codProducto?: string;
    producto?: string;
    codAgencia?: string;
    agencia?: string;
    funcionario?: string;
    codDestino?: string;
    destino?: string;
    ubigeoDep?: string;
    cantidadFinanciar?: number;
    plazo?: number;
    montoSolicitado?: number;
    idFlujoCaja?: number;
    codHP?: number | null;
    hpCosto?: number | null;
    hpPrecio?: number | null;
    hpRendimiento?: number | null;
    estadoFlujoCaja?: string;
    estadoPropuesta?: string;
}

export interface Column {
    field: string;
    header: string;
  }
