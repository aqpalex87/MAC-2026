import { createReducer, on } from '@ngrx/store';
import * as PDRActions from '../../actions/flujo-caja/pdr.actions';
import { FlujoCajaPDR } from 'src/app/models/flujocaja.interface';

export const estadoInicial: FlujoCajaPDR[] = [];

export const PdrReducer = createReducer(
  estadoInicial,
  on(PDRActions.cleanDPR, () => {
    return [];
  }),
  on(PDRActions.setPDR, (state, { items }) => {
    return (items && items.length > 0) ? [...items] : [...state]
  }),
  on(PDRActions.addItem, (state, { pdr }) => {
    return [...state, pdr];
  }),
  on(PDRActions.eliminarItem, (state, { numero }) => {
    const newState = state.filter(p => p.numero !== numero);
    let correlativo = 1;
    return newState.map(p => ({ ...p, numero: correlativo++ }));;
  }),
  on(PDRActions.editarItem, (state, { pdr }) => {
    return state.map(p => {
      if (p.numero == pdr.numero) {
        return { ...pdr };
      }
      return p;
    });
  })
);
