import { createReducer, on } from '@ngrx/store';
import * as FlujoCajaParametrosActions from '../../actions/flujo-caja/parametros.actions';
import { ParametroRSECondicion } from 'src/app/models/parametroRSECondicion.interface';
import { ParametroESFA } from 'src/app/models/parametroESFA.interface';

export const initialState: ParametroESFA[] = [];

export const parametroESFA = createReducer(
    initialState,
    on(FlujoCajaParametrosActions.setParametrosESFA, (state, { items }) => {
        return (items);
    }),
);