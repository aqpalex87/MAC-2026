import { createAction, props } from '@ngrx/store';
import { Rse } from 'src/app/models/flujocaja.interface';

export const cleanRSE = createAction(
    '[FC] Limpiar RSE'
)
export const setRSE = createAction(
    '[FC] Set RSE',
    props<{ rse: Rse }>()
)