import { createReducer, on } from '@ngrx/store';
import { HojaProducto } from 'src/app/models/hojaProducto.interface';
import { setHojaProducto } from '../../actions/hoja-producto/hoja.producto.actions';

export const estadoInicial: HojaProducto[] = [];

export const hojaProductoReducer = createReducer(
  estadoInicial,
  on(setHojaProducto, (state, { items }) => {
    return (items);
  })
);
