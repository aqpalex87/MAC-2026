import { createReducer, on } from '@ngrx/store';
import * as FlujoCajaActions from '../../actions/flujo-caja/flujo.caja.actions';
import { FlujoCaja } from 'src/app/models/flujocaja.interface';

export const estadoInicial: FlujoCaja = {};

export const FlujoCajaReducer = createReducer(
  estadoInicial,
  on(FlujoCajaActions.cleanFlujoCaja, () => {
    return null;
  }),
  on(FlujoCajaActions.setFlujoCaja, (state, { flujocaja }) => {
    return (flujocaja);
  }),
  on(FlujoCajaActions.setEsfaTree, (state, { esfaTree }) => {
    return { ...state, esfaTree: esfaTree }
  }),
  on(FlujoCajaActions.setEraTree, (state, { eraTree }) => {
    return { ...state, eraTree: eraTree }
  }),
  on(FlujoCajaActions.setHojaTrabajo, (state, { hojaTrabajo }) => {
    return { ...state, hojaTrabajo: hojaTrabajo }
  }),
);