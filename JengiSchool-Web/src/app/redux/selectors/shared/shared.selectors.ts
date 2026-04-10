import { createSelector } from '@ngrx/store';
import { AppState } from 'src/app/app.state';

export const selectMontoGUF = (state: AppState) => state.shared.montoGUF;
export const selectMontoESFA = (state: AppState) => state.shared.montoESFA;

export const selectIsCompletedGUF = (state: AppState) => state.shared.isCompletedGUF;
export const selectIsCompletedESFA = (state: AppState) => state.shared.isCompletedESFA;
export const selectIsCompletedERA = (state: AppState) => state.shared.isCompletedERA;
export const selectIsCompletedFC = (state: AppState) => state.shared.isCompletedFC;
export const selectIsCompletedRSE = (state: AppState) => state.shared.isCompletedRSE;

export const selectShared = createSelector(
    selectIsCompletedGUF,
    selectIsCompletedESFA,
    selectIsCompletedERA,
    selectIsCompletedFC,
    selectIsCompletedRSE,
    (feature1, feature2, feature3, feature4, feature5) => {
        return {
            isCompletedGUF: feature1,
            isCompletedESFA: feature2,
            isCompletedERA: feature3,
            isCompletedFC: feature4,
            isCompletedRSE: feature5
        };
    }
)

export const selectIsEditableFC = (state: AppState) => state.shared.editableFC;