import { createSelector } from "@ngrx/store";
import { AppState } from "src/app/app.state";

export const selectComentarioGUF = (state: AppState) => state.comentarios.comentarioGuf;
export const selectComentarioESFA = (state: AppState) => state.comentarios.comentarioEsfa;
export const selectComentarioERA = (state: AppState) => state.comentarios.comentarioEra;
export const selectComentarioFCD = (state: AppState) => state.comentarios.comentarioFcd;
export const selectComentarioRSE = (state: AppState) => state.comentarios.comentarioRse;

export const selectComentariosFC = createSelector(
    selectComentarioGUF,
    selectComentarioESFA,
    selectComentarioERA,
    selectComentarioFCD,
    selectComentarioRSE,
    (feature1, feature2, feature3, feature4, feature5) => {
        return {
            comentarioGuf: feature1,
            comentarioEsfa: feature2,
            comentarioEra: feature3,
            comentarioFcd: feature4,
            comentarioRse: feature5
        }
    }
)
