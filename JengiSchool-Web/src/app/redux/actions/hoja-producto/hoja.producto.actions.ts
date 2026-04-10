import { createAction, props } from '@ngrx/store';
import { HojaProducto } from 'src/app/models/hojaProducto.interface';

export const setHojaProducto = createAction(
    '[Hoja Producto] Set Hoja Producto',
    props<{ items: HojaProducto[] }>()
)