import { createAction, props } from "@ngrx/store";
import { FlujoCajaERA } from "src/app/models/flujoCajaERA.interface";

export const cleanTablaEra = createAction(
    '[FC] Limpiar Tabla ERA'
)

export const setTablaEra = createAction(
    '[FC] Set Tabla ERA',
    props<{ items: FlujoCajaERA[] }>()
)