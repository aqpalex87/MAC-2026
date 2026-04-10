import { createReducer, on } from '@ngrx/store';
import * as FlujoCajaParametrosActions from '../../actions/flujo-caja/parametros.actions';
import { ParametroTipoCliente } from 'src/app/models/parametroTipoCliente.interface';

export const initialState: ParametroTipoCliente[] = [];

export const parametroTipoClienteReducer = createReducer(
    initialState,
    on(FlujoCajaParametrosActions.setParametrosTipoCliente, (state, { items }) => {
        return (items);
    }),
);