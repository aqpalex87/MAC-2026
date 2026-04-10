import { createReducer, on } from '@ngrx/store';
import { FlujoCajaHP } from 'src/app/models/flujocaja.interface';
import * as FlujoCajaHPActions from '../../actions/flujo-caja/hp.actions';

export const estadoInicial: FlujoCajaHP[] = [];

export const hpReducer = createReducer(
    estadoInicial,
    on(FlujoCajaHPActions.setHP, (state, { items }) => {
        return (items && items.length > 0) ? [...items] : [...state];
    }),
    on(FlujoCajaHPActions.editarItem, (state, { hp }) => {
        return state.map(o => {
            if (o.codItem == hp.codItem) {
                return { ...hp };
            }
            return o;
        });
    })
);