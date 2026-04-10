import { createReducer, on } from '@ngrx/store';
import { openModal, closeModal } from '../../actions/flujo-caja/modal.actions';

export interface ModalState {
  isOpen: boolean;
}

const initialState: ModalState = {
  isOpen: false,
};

export function modalReducer(state = initialState, action: any): ModalState {
  switch (action.type) {
    case 'OPEN_MODAL':
      return { isOpen: true };
    case 'CLOSE_MODAL':
      return { isOpen: false };
    default:
      return state;
  }
}