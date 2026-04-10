import { createAction, props } from '@ngrx/store';
import { FlujoCajaRatio } from 'src/app/models/flujocaja.interface';

export const cleanRatios = createAction(
    '[Ratios] Limpiar Ratios'
)

export const setRatios = createAction(
    '[Ratios] Set Ratios',
    props<{ items: FlujoCajaRatio[] }>()
)

export const editarRatio = createAction(
    '[Ratios] Editar Ratio',
    props<{ ratio: FlujoCajaRatio }>()
);