import { createReducer, on } from '@ngrx/store';
import * as FlujoCajaParametrosActions from '../../actions/flujo-caja/parametros.actions';
import { ParametroComportamiento } from 'src/app/models/parametroComportamiento.interface';

export const initialState: ParametroComportamiento[] = [];

export const parametroComportamientoReducer = createReducer(
    initialState,
    on(FlujoCajaParametrosActions.setParametrosComportamiento, (state, { items }) => {
        return (items);
    }),
);