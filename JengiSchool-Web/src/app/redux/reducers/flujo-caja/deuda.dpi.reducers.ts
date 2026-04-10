import { createReducer, on } from "@ngrx/store";
import * as FlujoCajaActionsDPI from '../../actions/flujo-caja/deuda.dpi.actions';
import { FlujoCajaDPI } from "src/app/models/flujocaja.interface";

export const initialState: FlujoCajaDPI[] = [];

export const deudadpiReducer = createReducer(
    initialState,
    on(FlujoCajaActionsDPI.cleanDeudaIndirecta, () => {
        return [];
    }),
    on(FlujoCajaActionsDPI.addDeudaIndirecta, (state, { deudaindirecta }) => {
        return [...state, deudaindirecta]
    }),
    on(FlujoCajaActionsDPI.updateDeudaIndirecta, (state, { deudaindirecta }) => {
        return state.map(p => {
            if (p.idParametroDpi == deudaindirecta.idParametroDpi) {
                return { ...deudaindirecta };
            }
            return p;
        });
    })
);