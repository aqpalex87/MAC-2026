import { AppState } from 'src/app/app.state';
import { selectTablaERA } from './era.selectors';
import { selectTablaESFA } from './esfa.selectors';
import { createSelector } from '@ngrx/store';

export const selectRatios = (state: AppState) => state.ratios;

export const selectUnion_ESFA_ERA = createSelector(
    selectTablaERA,
    selectTablaESFA,
    (feature1, feature2) => {
        if ((feature1 && feature1.length > 0) && (feature2 && feature2.length > 0))
            return {
                era: feature1,
                esfa: feature2,
            }
        else
            return null;
    }
)