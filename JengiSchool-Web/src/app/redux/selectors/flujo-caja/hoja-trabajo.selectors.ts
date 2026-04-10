import { AppState } from 'src/app/app.state';

export const selectHojaTrabajo = (state: AppState) => state.flujoCaja.hojaTrabajo;
