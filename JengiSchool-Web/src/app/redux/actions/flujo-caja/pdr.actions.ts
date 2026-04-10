import { createAction, props } from '@ngrx/store';
import { FlujoCajaPDR } from 'src/app/models/flujocaja.interface';

export const cleanDPR = createAction(
    '[PlanDesembolso] Limpiar PDR'
);

export const addItem = createAction(
    '[PlanDesembolso] Agregar Item',
    props<{ pdr: FlujoCajaPDR }>()
);

export const eliminarItem = createAction(
    '[PlanDesembolso] Eliminar Item',
    props<{ numero: number }>()
);

export const editarItem = createAction(
    '[PlanDesembolso] Editar Item',
    props<{ pdr: FlujoCajaPDR }>()
);

export const setPDR = createAction(
    '[PlanDesembolso] Set PDR',
    props<{ items: FlujoCajaPDR[] }>()
)