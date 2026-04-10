import { createSelector } from "@ngrx/store";
import { AppState } from "src/app/app.state";
import { selectMontoGUF } from "../shared/shared.selectors";

export const selectTablaERA = (state: AppState) => state.era;

export const selectTabERA = createSelector(
    selectTablaERA,
    selectMontoGUF,
    (feature1, feature2) => {
        return {
            era: feature1,
            montoGUF: feature2,
        }
    }
)