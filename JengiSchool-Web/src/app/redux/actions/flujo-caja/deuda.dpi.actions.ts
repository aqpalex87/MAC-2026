import { createAction, props } from "@ngrx/store";
import { FlujoCajaDPI } from "src/app/models/flujocaja.interface";

export const cleanDeudaIndirecta = createAction(
    '[DeudaIndirecta] Limpiar DeudaIndirecta'
);

export const addDeudaIndirecta = createAction(
    '[DeudaIndirecta] Agregar DeudaIndirecta',
    props<{ deudaindirecta: FlujoCajaDPI }>()
);

export const updateDeudaIndirecta = createAction(
    '[DeudaIndirecta] Actualizar DeudaIndirecta',
    props<{ deudaindirecta: FlujoCajaDPI }>()
);