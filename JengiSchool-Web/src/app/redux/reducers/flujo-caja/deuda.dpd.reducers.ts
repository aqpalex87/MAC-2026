import { createReducer, on } from "@ngrx/store";
import * as FlujoCajaActionsDPD from '../../actions/flujo-caja/deuda.dpd.actions';
import { FlujoCajaDPD } from "src/app/models/flujocaja.interface";

export const initialState: FlujoCajaDPD[] = [];

export const deudadpdReducer = createReducer(
    initialState,
    on(FlujoCajaActionsDPD.cleanDeudaDirecta, () => {
        return [];
    }),
    on(FlujoCajaActionsDPD.addDeudaDirecta, (state, { deudadirecta }) => {
        return [...state, deudadirecta]
    }),
    on(FlujoCajaActionsDPD.updateDeudaDirecta, (state, { deudadirecta }) => {
        return state.map(p => {
            if (p.idParametroDpd == deudadirecta.idParametroDpd) {
                return { ...deudadirecta };
            }
            return p;
        });
    })
);