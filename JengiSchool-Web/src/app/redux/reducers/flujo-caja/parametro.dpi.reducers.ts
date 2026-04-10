import { createReducer, on } from '@ngrx/store';
import * as FlujoCajaParametrosActions from '../../actions/flujo-caja/parametros.actions';
import { ParametroDPIModal } from 'src/app/models/parametroDPI.interface';

export const initialState: ParametroDPIModal[] = [];

export const parametrodpiReducer = createReducer(
    initialState,
    on(FlujoCajaParametrosActions.setParametrosDPI, (state, { items }) => {
        return (items);
    }),
);