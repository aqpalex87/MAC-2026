import { createReducer, on } from '@ngrx/store';
import * as RatiosActions from '../../actions/flujo-caja/ratios.actions';
import { FlujoCajaRatio } from 'src/app/models/flujocaja.interface';

export const estadoInicial: FlujoCajaRatio[] = [];

export const RatiosReducer = createReducer(
    estadoInicial,
    on(RatiosActions.setRatios,()=>{
        return null
    }),
    on(RatiosActions.setRatios, (state, { items }) => {
        return (items && items.length > 0) ? [...items] : [...state]
    }),
    on(RatiosActions.editarRatio, (state, { ratio }) => {
        return state.map(r => {
            if (r.idParametroRatio == ratio.idParametroRatio) {
                return { ...ratio };
            }
            return r;
        });
    })
);