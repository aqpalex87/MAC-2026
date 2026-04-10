import { createReducer, on } from '@ngrx/store';
import { Solicitud } from 'src/app/models/solicitud.interface';
import { setSolicitud } from '../../actions/flujo-caja/flujo.caja.actions';

export const estadoInicial: Solicitud = {
  tipoDocumento:     '',
  numeroDocumento:   '',
  nombres:           '',
  tipoCliente:       '',
  numeroSolicitud:   0,
  codProducto:       '',
  producto:          '',
  codAgencia:        '',
  agencia:           '',
  funcionario:       '',
  codDestino:        '',
  destino:           '',
  ubigeoDep:         '',
  cantidadFinanciar: 0,
  plazo:             0,
  montoSolicitado:   0,
  idFlujoCaja:       0,
  hpCosto:           0,
  hpPrecio:          0,
  hpRendimiento:     0,
  estadoFlujoCaja:   '',
  estadoPropuesta:   '',
};

export const SolicitudReducer = createReducer(estadoInicial,
  on( setSolicitud, (state, { solicitud }) => {
    return (solicitud);
  }),
  
);
