import { createAction, props } from "@ngrx/store";
import { Sensibilizaciones } from "src/app/models/shared.interface";

/*export const setSensibilizaciones = createAction(
    '[Flujo Caja] Set Sensibilizaciones',
    props<{ sensibilizaciones: Sensibilizaciones }>()
)*/

export const setSensibilizacionesRendimientoPromedio = createAction(
    '[FCD] Set Sensibilizaciones rendimientoPromedio',
    props<{ rendimientoPromedio: number }>()
)
export const setSensibilizacionesPrecioPromedio = createAction(
    '[FCD] Set Sensibilizaciones precioPromedio',
    props<{ precioPromedio: number }>()
)
export const setSensibilizacionesSvCosto = createAction(
    '[FCD] Set Sensibilizaciones svCosto',
    props<{ svCosto: number }>()
)
export const setSensibilizacionesSvRendimiento = createAction(
    '[FCD] Set Sensibilizaciones svRendimiento',
    props<{ svRendimiento: number }>()
)
export const setSensibilizacionesSvPrecio = createAction(
    '[FCD] Set Sensibilizaciones svPrecio',
    props<{ svPrecio: number }>()
)