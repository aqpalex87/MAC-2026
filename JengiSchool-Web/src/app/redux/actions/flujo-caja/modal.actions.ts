import { createAction } from '@ngrx/store';

export const openModal = () => ({ type: 'OPEN_MODAL' });
export const closeModal = () => ({ type: 'CLOSE_MODAL' });