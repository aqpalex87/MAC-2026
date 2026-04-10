export interface SolicitudCredito {
    numeroSolicitud: number;
    idFlujoCaja: number;
    tipoDocumento: string;
    numeroDocumento: string;
    nombres: string;
    estadoFlujoCaja: string;
    estadoPropuesta: string;
    estadoCredito: string;

    tipoCliente: string;
    codProducto: string;
    producto: string;
    codAgencia: string;
    agencia: string;
    funcionario: string;
    codDestino: string;
    destino: string;
    ubigeoDep: string;
    cantidadFinanciar: number;
    plazo: number;
    montoSolicitado: number;
    hPCosto: number;
    hPPrecio: number;
    hPRendimiento: number;

}

export interface SolicitudCreditoFiltro {
    numeroSolicitud: string;
    idFlujoCaja: string;
    numeroDocumento: string;
    nombres: string;
}

