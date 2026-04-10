import * as SharedActions from '../../actions/shared/shared.actions';
import { Shared } from 'src/app/models/shared.interface';
import { createReducer, on } from '@ngrx/store';

export const estadoInicial: Shared = {
    montoESFA: 0,
    isCompletedGUF: false,
    isCompletedESFA: false,
    isCompletedERA: false,
    isCompletedFC: false,
    isCompletedRSE: false,
    editableFC: false,
    comentarioGUF: ''
};

export const SharedReducer = createReducer(
    estadoInicial,
    on(SharedActions.setMontoGUF, (state, { monto }) => {
        return { ...state, montoGUF: monto }
    }),
    on(SharedActions.setMontoESFA, (state, { monto }) => {
        return { ...state, montoESFA: monto }
    }),
    on(SharedActions.isCompletedGUF, (state, { isCompleted }) => {
        return { ...state, isCompletedGUF: isCompleted }
    }),
    on(SharedActions.isCompletedESFA, (state, { isCompleted }) => {
        return { ...state, isCompletedESFA: isCompleted }
    }),
    on(SharedActions.isCompletedERA, (state, { isCompleted }) => {
        return { ...state, isCompletedERA: isCompleted }
    }),
    on(SharedActions.isCompletedFC, (state, { isCompleted }) => {
        return { ...state, isCompletedFC: isCompleted }
    }),
    on(SharedActions.isCompletedRSE, (state, { isCompleted }) => {
        return { ...state, isCompletedRSE: isCompleted }
    }),
    on(SharedActions.setModoFC, (state, { isEditableFC }) => {
        return { ...state, editableFC: isEditableFC }
    }),
    on(SharedActions.setModoParametro, (state, { parametro }) => {
        return { ...state, parametro: parametro }
    }),
);