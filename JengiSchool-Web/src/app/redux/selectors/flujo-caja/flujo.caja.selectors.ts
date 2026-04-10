import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { selectPdr } from './pdr.selectors';
import { selectParametrosDPD, selectParametrosDPI } from './parametros.selectors';
import { selectTabRSE } from './rse.selectors';
import { selectSolicitud } from './solicitud.selectors';
import { selectOtrosCargos } from './oc.selectors';
import { selectFlujoCajaHP } from './hp.selectors';
import { selectDeudaDPD } from './deuda.dpd.selectors';
import { selectDeudaDPI } from './deuda.dpi.selectors';

export const selectAppState = createFeatureSelector<AppState>('appstate');

export const selectDeudasDirectas = createSelector(
  selectAppState,
  (state) => state.deudadirecta
);

export const selectDeudasIndirectas = createSelector(
  selectAppState,
  (state) => state.deudaindirecta
);

export const selectFlujoCaja = (state: AppState) => state.flujoCaja;

export const selectFlujoCajaRSE = (state: AppState) => state.rse;

export const selectFlujoCajaESFA = (state: AppState) => state.esfa;

export const selectOC = (state: AppState) => state.oc;

export const selectFCD_GUF = (state: AppState) => state.guf;
export const selectFCD_ESFA = (state: AppState) => state.esfa;
export const selectFCD_ERA = (state: AppState) => state.era;
export const selectFCD_FC = (state: AppState) => state.fcDetalle;
export const selectFCD_RSE = (state: AppState) => state.rse;

export const selectFlujoCajaHT = (state: AppState) => state.flujoCaja.hojaTrabajo;

export const selectFCData = createSelector(
  selectFlujoCaja,
  selectPdr,
  selectOtrosCargos,
  selectFlujoCajaHP,
  selectDeudaDPD,
  selectDeudaDPI,
  selectTabRSE,
  selectSolicitud,
  (feature1, feature2, feature3, feature4, feature5, feature6, feature7, feature8) => {
    return {
      flujoCaja: feature1,
      pdr: feature2,
      oc: feature3,
      flujoCajaHP: feature4,
      deudaDPD: feature5,
      deudaDPI: feature6,
      rse: feature7,
      solicitud: feature8
    }
  }
)


