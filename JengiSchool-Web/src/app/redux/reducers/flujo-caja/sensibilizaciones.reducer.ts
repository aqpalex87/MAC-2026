import * as SensibilizacionesActions from '../../actions/flujo-caja/sensibilizaciones.actions';
import { Sensibilizaciones } from 'src/app/models/shared.interface';
import { createReducer, on } from '@ngrx/store';

export const estadoInicial: Sensibilizaciones = {
    rendimientoPromedio: 0,
    precioPromedio: 0,
    svCosto: 0,
    svRendimiento: 0,
    svPrecio: 0
};

export const SensibilizacionesReducer = createReducer(
    estadoInicial,
    on(SensibilizacionesActions.setSensibilizacionesPrecioPromedio, (state, { precioPromedio }) => {
        return { ...state, precioPromedio }
    }),
    on(SensibilizacionesActions.setSensibilizacionesRendimientoPromedio, (state, { rendimientoPromedio }) => {
        return { ...state, rendimientoPromedio }
    }),
    on(SensibilizacionesActions.setSensibilizacionesSvCosto, (state, { svCosto }) => {
        return { ...state, svCosto }
    }),
    on(SensibilizacionesActions.setSensibilizacionesSvRendimiento, (state, { svRendimiento }) => {
        return { ...state, svRendimiento }
    }),
    on(SensibilizacionesActions.setSensibilizacionesSvPrecio, (state, { svPrecio }) => {
        return { ...state, svPrecio }
    })
);