import { createAction, props } from "@ngrx/store";
import { FlujoCajaDetalle } from "src/app/models/FlujoCajaDetalle.interface";

export const setTablaFCDetalle = createAction(
    '[FC] Set Tabla FlujoCajaDetalle',
    props<{ items: FlujoCajaDetalle[] }>()
)