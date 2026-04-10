import { createReducer, on } from '@ngrx/store';
import * as ERAActions from '../../actions/flujo-caja/era.actions';
import { FlujoCajaERA } from 'src/app/models/flujoCajaERA.interface';

export const estadoInicial: FlujoCajaERA[] = [];

export const EraReducer = createReducer(
    estadoInicial,
    on(ERAActions.cleanTablaEra, () => {
        return [];
    }),
    on(ERAActions.setTablaEra, (state, { items }) => {
        return (items);
    })
);