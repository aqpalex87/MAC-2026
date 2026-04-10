import { createReducer, on } from '@ngrx/store';
import * as RSEActions from '../../actions/flujo-caja/rse.actions';
import { Rse } from 'src/app/models/flujocaja.interface';

export const estadoInicial: Rse = {
    nroEntidades: 0,
    ratioCP: 0,
    totCuotasCredito: 0,
    totCuotasDD: 0,
    totDeudaPotenciales: 0,
    totExcedentes: 0,
    tipoCliente: '',
    comportamiento: '',
    deudaSisFinanciero: 0,
    resultado: '',
    condicion: '',
};

export const rseReducer = createReducer(
    estadoInicial,
    on(RSEActions.cleanRSE, () => {
        return {
            nroEntidades: 0,
            ratioCP: 0,
            totCuotasCredito: 0,
            totCuotasDD: 0,
            totDeudaPotenciales: 0,
            totExcedentes: 0,
            tipoCliente: '',
            comportamiento: '',
            deudaSisFinanciero: 0,
            resultado: '',
            condicion: '',
        };
    }),
    on(RSEActions.setRSE, (state, { rse }) => {
        return rse ? { ...rse } : { ...state };
    })
);