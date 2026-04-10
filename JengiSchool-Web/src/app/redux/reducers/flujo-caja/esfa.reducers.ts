import { createReducer, on } from '@ngrx/store';
import * as ESFAActions from '../../actions/flujo-caja/esfa.actions';
import { FlujoCajaESFA } from 'src/app/models/flujoCajaESFA.interface';

export const estadoInicial: FlujoCajaESFA[] = [];

export const EsfaReducer = createReducer(
    estadoInicial,
    on(ESFAActions.cleanTablaEsfa, () => {
        return [];
    }),
    on(ESFAActions.setTablaEsfa, (state, { items }) => {
        return (items);
    })
);