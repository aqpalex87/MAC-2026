import { createAction, props } from "@ngrx/store";
import { FlujoCajaGUF } from "src/app/models/FlujoCajaGUF.interface";

export const cleanTablaGuf = createAction(
    '[FC] Limpiar Tabla GUF'
)
export const setTablaGuf = createAction(
    '[FC] Set Tabla GUF',
    props<{ items: FlujoCajaGUF[] }>()
)