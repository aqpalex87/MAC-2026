import { createAction, props } from '@ngrx/store';
import { FlujoCajaOC } from '../../../models/flujocaja.interface';

export const setOC = createAction(
    '[OtrosCargos] setOC',
    props<{ items: FlujoCajaOC[] }>()
);

export const editarItem = createAction(
    '[OtrosCargos] Editar Item',
    props<{ oc: FlujoCajaOC }>()
);