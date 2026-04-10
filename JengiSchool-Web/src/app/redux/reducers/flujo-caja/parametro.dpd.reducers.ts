import { createReducer, on } from '@ngrx/store';
import * as FlujoCajaParametrosActions from '../../actions/flujo-caja/parametros.actions';
import { ParametroDPDModal } from 'src/app/models/parametroDPD.interface';

export const initialState: ParametroDPDModal[] = [];

export const parametrodpdReducer = createReducer(
    initialState,
    on(FlujoCajaParametrosActions.setParametrosDPD, (state, { items }) => {
        return (items);
    }),
);