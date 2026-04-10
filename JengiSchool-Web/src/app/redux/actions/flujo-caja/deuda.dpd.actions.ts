import { createAction, props } from "@ngrx/store";
import { FlujoCajaDPD } from "src/app/models/flujocaja.interface";

export const cleanDeudaDirecta = createAction(
    '[DeudaDirecta] Limpiar DeudaDirecta'
);

export const addDeudaDirecta = createAction(
    '[DeudaDirecta] Agregar DeudaDirecta',
    props<{ deudadirecta: FlujoCajaDPD }>()
);
export const updateDeudaDirecta = createAction(
    '[DeudaDirecta] Actualizar DeudaDirecta',
    props<{ deudadirecta: FlujoCajaDPD }>()
);

