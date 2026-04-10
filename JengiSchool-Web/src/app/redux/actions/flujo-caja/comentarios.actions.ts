import { createAction, props } from "@ngrx/store";

export const setComentarioGUF = createAction(
    '[FCD] Set Comentario GUF',
    props<{ comentarioGuf: string }>()
)
export const setComentarioESFA = createAction(
    '[FCD] Set Comentario ESFA',
    props<{ comentarioEsfa: string }>()
)
export const setComentarioERA = createAction(
    '[FCD] Set Comentario ERA',
    props<{ comentarioEra: string }>()
)
export const setComentarioFCD = createAction(
    '[FCD] Set Comentario FCD',
    props<{ comentarioFcd: string }>()
)
export const setComentarioRSE = createAction(
    '[FCD] Set Comentario RSE',
    props<{ comentarioRse: string }>()
)