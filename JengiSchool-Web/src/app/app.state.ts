import { ActionReducerMap } from '@ngrx/store';
import { Solicitud } from './models/solicitud.interface';
import { SolicitudReducer } from './redux/reducers/flujo-caja/solicitud.reducers';
import { DeudaDirecta, DeudaIndirecta, FlujoCaja, FlujoCajaDPD, FlujoCajaDPI, FlujoCajaHP, FlujoCajaOC, FlujoCajaPDR, FlujoCajaRatio, Rse } from './models/flujocaja.interface';
import { PdrReducer } from './redux/reducers/flujo-caja/pdr.reducers';
import { OcReducer } from './redux/reducers/flujo-caja/oc.reducers';
import { hpReducer } from './redux/reducers/flujo-caja/hp.reducers';
import { ParametroDPDModal } from './models/parametroDPD.interface';
import { ParametroDPIModal } from './models/parametroDPI.interface';
import { parametrodpdReducer } from './redux/reducers/flujo-caja/parametro.dpd.reducers';
import { parametrodpiReducer } from './redux/reducers/flujo-caja/parametro.dpi.reducers';
import { deudadpdReducer } from './redux/reducers/flujo-caja/deuda.dpd.reducers';
import { deudadpiReducer } from './redux/reducers/flujo-caja/deuda.dpi.reducers';
import { HojaProducto } from './models/hojaProducto.interface';
import { hojaProductoReducer } from './redux/reducers/hoja-producto/hoja.producto.reducers';
import { FlujoCajaReducer } from './redux/reducers/flujo-caja/flujo.caja.reducers';
import { SharedReducer } from './redux/reducers/shared/shared.reducers';
import { Comentarios, Sensibilizaciones, Shared } from './models/shared.interface';
import { rseReducer } from './redux/reducers/flujo-caja/rse.reducers';
import { RatiosReducer } from './redux/reducers/flujo-caja/ratios.reducers';
import { FlujoCajaGUF } from './models/FlujoCajaGUF.interface';
import { GufReducer } from './redux/reducers/flujo-caja/guf.reducers';
import { FlujoCajaESFA } from './models/flujoCajaESFA.interface';
import { EsfaReducer } from './redux/reducers/flujo-caja/esfa.reducers';
import { FlujoCajaERA } from './models/flujoCajaERA.interface';
import { EraReducer } from './redux/reducers/flujo-caja/era.reducers';
import { FlujoCajaDetalle } from './models/FlujoCajaDetalle.interface';
import { FcDetalleReducer } from './redux/reducers/flujo-caja/fcdetalle.reducers';
import { ComentariosReducer } from './redux/reducers/flujo-caja/comentarios.reducers';
import { ParametroAlerta } from './models/parametroAlerta.interface';
import { parametroAlertaReducer } from './redux/reducers/flujo-caja/parametro.alertas.reducer';
import { ParametroComportamiento } from './models/parametroComportamiento.interface';
import { ParametroTipoCliente } from './models/parametroTipoCliente.interface';
import { parametroComportamientoReducer } from './redux/reducers/flujo-caja/parametro.comportamiento.reducer';
import { parametroTipoClienteReducer } from './redux/reducers/flujo-caja/parametro.tipocliente.reducer';
import { SensibilizacionesReducer } from './redux/reducers/flujo-caja/sensibilizaciones.reducer';
import { ParametroRSECondicion } from './models/parametroRSECondicion.interface';
import { parametroRSECondicionesReducer } from './redux/reducers/flujo-caja/parametro.rsecondiciones.reducer';
import { ParametroESFA } from './models/parametroESFA.interface';
import { parametroESFA } from './redux/reducers/flujo-caja/parametro.esfa.reducer';

export interface AppState {
  deudadirecta?: DeudaDirecta[];
  deudaindirecta?: DeudaIndirecta[];
  parametrosDPD?: ParametroDPDModal[];
  parametrosDPI?: ParametroDPIModal[];
  parametrosAlerta?: ParametroAlerta[];
  parametrosComportamiento?: ParametroComportamiento[];
  parametrosTipoCliente?: ParametroTipoCliente[];
  parametrosRSECondiciones?: ParametroRSECondicion[];
  parametrosESFA?: ParametroESFA[];
  solicitud?: Solicitud;
  pdr?: FlujoCajaPDR[];
  oc?: FlujoCajaOC[];
  flujocajaHP?:FlujoCajaHP[];
  flujoCaja?: FlujoCaja;
  deudaDPD?: FlujoCajaDPD[];
  deudaDPI?: FlujoCajaDPI[];
  hojaProducto?: HojaProducto[];
  shared?: Shared;
  rse?: Rse;
  ratios?: FlujoCajaRatio[];
  guf?: FlujoCajaGUF[];
  esfa?: FlujoCajaESFA[];
  era?: FlujoCajaERA[];
  fcDetalle?: FlujoCajaDetalle[];
  comentarios?: Comentarios;
  sensibilizaciones?:Sensibilizaciones;
}

export const appReducers: ActionReducerMap<AppState> = {
  solicitud: SolicitudReducer,
  pdr: PdrReducer,
  oc: OcReducer,
  flujoCaja: FlujoCajaReducer,
  parametrosDPD: parametrodpdReducer,
  parametrosDPI: parametrodpiReducer,
  parametrosAlerta: parametroAlertaReducer,
  parametrosComportamiento: parametroComportamientoReducer,
  parametrosTipoCliente: parametroTipoClienteReducer,
  parametrosRSECondiciones: parametroRSECondicionesReducer,
  parametrosESFA: parametroESFA,
  deudaDPD: deudadpdReducer,
  deudaDPI: deudadpiReducer,
  hojaProducto: hojaProductoReducer,
  flujocajaHP:hpReducer,
  shared: SharedReducer,
  rse: rseReducer,
  ratios: RatiosReducer,
  guf: GufReducer,
  esfa: EsfaReducer,
  era: EraReducer,
  fcDetalle: FcDetalleReducer,
  comentarios: ComentariosReducer,
  sensibilizaciones:SensibilizacionesReducer
}

