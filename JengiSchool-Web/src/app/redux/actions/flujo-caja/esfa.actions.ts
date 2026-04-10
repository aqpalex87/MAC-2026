import { createAction, props } from "@ngrx/store";

import { FlujoCajaESFA } from "src/app/models/flujoCajaESFA.interface";

export const cleanTablaEsfa = createAction(
    '[FC] Limpiar Tabla ESFA'
)

export const setTablaEsfa = createAction(
    '[FC] Set Tabla ESFA',
    props<{ items: FlujoCajaESFA[] }>()
)