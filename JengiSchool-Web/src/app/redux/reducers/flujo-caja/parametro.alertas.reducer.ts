import { createReducer, on } from '@ngrx/store';
import * as FlujoCajaParametrosActions from '../../actions/flujo-caja/parametros.actions';
import { ParametroAlerta } from 'src/app/models/parametroAlerta.interface';

export const initialState: ParametroAlerta[] = [];

export const parametroAlertaReducer = createReducer(
    initialState,
    on(FlujoCajaParametrosActions.setParametrosAlerta, (state, { items }) => {
        return (items);
    }),
);