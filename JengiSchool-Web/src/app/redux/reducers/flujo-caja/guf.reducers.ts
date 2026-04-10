import { createReducer, on } from '@ngrx/store';
import * as GUFActions from '../../actions/flujo-caja/guf.actions';
import { FlujoCajaGUF } from 'src/app/models/FlujoCajaGUF.interface';

export const estadoInicial: FlujoCajaGUF[] = [];

export const GufReducer = createReducer(
    estadoInicial,
    on(GUFActions.cleanTablaGuf, () => {
        return [];
    }),
    on(GUFActions.setTablaGuf, (state, { items }) => {
        return (items);
    })
);