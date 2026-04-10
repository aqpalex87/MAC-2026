import { createAction, props } from "@ngrx/store";
import { ParametroNuevo } from "src/app/models/shared.interface";

export const setMontoGUF = createAction(
    '[GUF] Set Monto GUF',
    props<{ monto: number }>()
)

export const setComentarioGuf = createAction(
    '[FC] Set Comentario GUF',
    props<{ comentarioGuf: string }>()
)

export const setMontoESFA = createAction(
    '[ESFA] Set Monto ESFA',
    props<{ monto: number }>()
)

export const isCompletedGUF = createAction(
    '[GUF] Set status completed GUF',
    props<{ isCompleted: boolean }>()
)
export const isCompletedESFA = createAction(
    '[ESFA] Set status completed ESFA',
    props<{ isCompleted: boolean }>()
)
export const isCompletedERA = createAction(
    '[ERA] Set status completed ERA',
    props<{ isCompleted: boolean }>()
)
export const isCompletedFC = createAction(
    '[FC] Set status completed FC',
    props<{ isCompleted: boolean }>()
)
export const isCompletedRSE = createAction(
    '[RSE] Set status completed RSE',
    props<{ isCompleted: boolean }>()
)

export const setModoFC = createAction(
    '[FC] Set modo FC',
    props<{ isEditableFC: boolean }>()
)

export const setModoParametro = createAction(
    '[Mantenimiento Parametro] Set Parametro',
    props<{ parametro: ParametroNuevo }>()
)