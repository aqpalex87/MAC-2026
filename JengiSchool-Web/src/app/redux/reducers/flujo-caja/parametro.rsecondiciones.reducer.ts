import { createReducer, on } from '@ngrx/store';
import * as FlujoCajaParametrosActions from '../../actions/flujo-caja/parametros.actions';
import { ParametroRSECondicion } from 'src/app/models/parametroRSECondicion.interface';

export const initialState: ParametroRSECondicion[] = [];

export const parametroRSECondicionesReducer = createReducer(
    initialState,
    on(FlujoCajaParametrosActions.setParametrosRSECondiciones, (state, { items }) => {
        return (items);
    }),
);