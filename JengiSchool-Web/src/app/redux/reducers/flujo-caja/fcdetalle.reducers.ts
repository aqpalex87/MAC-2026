import { createReducer, on } from '@ngrx/store';
import * as FCDetalleActions from '../../actions/flujo-caja/fcdetalle.actions';
import { FlujoCajaDetalle } from 'src/app/models/FlujoCajaDetalle.interface';

export const estadoInicial: FlujoCajaDetalle[] = [];

export const FcDetalleReducer = createReducer(
    estadoInicial,
    on(FCDetalleActions.setTablaFCDetalle, (state, { items }) => {
        return (items);
    })
);