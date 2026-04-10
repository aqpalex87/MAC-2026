import { createReducer, on } from '@ngrx/store';
import { FlujoCajaOC } from 'src/app/models/flujocaja.interface';
import * as FlujoCajaOCActions from '../../actions/flujo-caja/oc.actions';

export const estadoInicial: FlujoCajaOC[] = [];

export const OcReducer = createReducer(
    estadoInicial,
    on(FlujoCajaOCActions.setOC, (state, { items }) => {
        return (items && items.length > 0) ? [...items] : [...state];
    }),
    on(FlujoCajaOCActions.editarItem, (state, { oc }) => {
        return state.map(o => {
            if (o.codItem == oc.codItem) {
                return { ...oc };
            }
            return o;
        });
    })
);