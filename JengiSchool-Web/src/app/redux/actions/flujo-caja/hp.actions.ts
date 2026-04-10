import { createAction, props } from '@ngrx/store';
import { FlujoCajaHP } from '../../../models/flujocaja.interface';

export const setHP = createAction(
    '[FlujoCajaHP] setHP',
    props<{ items: FlujoCajaHP[] }>()
);

export const editarItem = createAction(
    '[FlujoCajaHP] Editar Item',
    props<{ hp: FlujoCajaHP }>()
);