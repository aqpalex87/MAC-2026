import { createSelector } from "@ngrx/store";
import { AppState } from "src/app/app.state";

export const selectSensibilizaciones = (state: AppState) => state.sensibilizaciones;

/*export const selectSensibilizacionesRendimientoPromedio = (state: AppState) => state.sensibilizaciones.rendimientoPromedio;
export const selectSensibilizacionesPrecioPromedio = (state: AppState) => state.sensibilizaciones.precioPromedio;
export const selectSensibilizacionesSvCosto = (state: AppState) => state.sensibilizaciones.svCosto;
export const selectSensibilizacionesSvRendimiento = (state: AppState) => state.sensibilizaciones.svRendimiento;
export const selectSensibilizacionesSvPrecio = (state: AppState) => state.sensibilizaciones.svPrecio;

export const selectSensibilizaciones = createSelector(
    selectSensibilizacionesRendimientoPromedio,
    selectSensibilizacionesPrecioPromedio,
    selectSensibilizacionesSvCosto,
    selectSensibilizacionesSvRendimiento,
    selectSensibilizacionesSvPrecio,
    (feature1, feature2, feature3, feature4, feature5) => {
        return {
            rendimientoPromedio: feature1,
            precioPromedio: feature2,
            svCosto: feature3,
            svRendimiento: feature4,
            svPrecio: feature5
        }
    }
)*/