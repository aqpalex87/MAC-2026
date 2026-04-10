import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ModalState } from '../../reducers/flujo-caja/modal.reducer';

export const selectModalState = createFeatureSelector<ModalState>('modal');

export const isModalOpen = createSelector(
  selectModalState,
  (state) => state.isOpen
);
