import * as ComentariosActions from '../../actions/flujo-caja/comentarios.actions';
import { Comentarios } from 'src/app/models/shared.interface';
import { createReducer, on } from '@ngrx/store';

export const estadoInicial: Comentarios = {
    comentarioGuf: '',
    comentarioEsfa: '',
    comentarioEra: '',
    comentarioFcd: '',
    comentarioRse: ''
};

export const ComentariosReducer = createReducer(
    estadoInicial,
    on(ComentariosActions.setComentarioGUF, (state, { comentarioGuf }) => {
        return { ...state, comentarioGuf }
    }),
    on(ComentariosActions.setComentarioESFA, (state, { comentarioEsfa }) => {
        return { ...state, comentarioEsfa }
    }),
    on(ComentariosActions.setComentarioERA, (state, { comentarioEra }) => {
        return { ...state, comentarioEra }
    }),
    on(ComentariosActions.setComentarioFCD, (state, { comentarioFcd }) => {
        return { ...state, comentarioFcd }
    }),
    on(ComentariosActions.setComentarioRSE, (state, { comentarioRse }) => {
        return { ...state, comentarioRse }
    })
);