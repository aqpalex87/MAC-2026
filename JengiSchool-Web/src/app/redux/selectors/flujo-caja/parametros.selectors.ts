import { AppState } from 'src/app/app.state';

export const selectParametrosDPD = (state: AppState) => state.parametrosDPD;

export const selectParametrosDPI = (state: AppState) => state.parametrosDPI;

export const selectParametrosAlerta = (state: AppState) => state.parametrosAlerta;

export const selectParametrosComportamiento = (state: AppState) => state.parametrosComportamiento;

export const selectParametrosTipoCliente = (state: AppState) => state.parametrosTipoCliente;

export const selectParametrosRSECondiciones = (state: AppState) => state.parametrosRSECondiciones;

export const selectParametrosESFA = (state: AppState) => state.parametrosESFA;