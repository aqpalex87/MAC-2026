import { createAction, props } from '@ngrx/store';
import { Solicitud } from 'src/app/models/solicitud.interface';
import { DeudaDirecta, DeudaIndirecta, FlujoCaja , FlujoCajaHT  } from '../../../models/flujocaja.interface';
import { FlujoCajaESFA } from 'src/app/models/flujoCajaESFA.interface';
import { FlujoCajaERA } from 'src/app/models/flujoCajaERA.interface';
import { FlujoCajaDetalle } from 'src/app/models/FlujoCajaDetalle.interface';

export const cleanDeudaDirecta = createAction(
    '[DeudaDirecta] Limpiar DeudaDirecta'
);

export const cleanDeudaIndirecta = createAction(
    '[DeudaIndirecta] Limpiar DeudaIndirecta'
);

export const addDeudaDirecta = createAction(
    '[DeudaDirecta] Agregar DeudaDirecta',
    props<{ deudadirecta: DeudaDirecta }>()
);
export const updateDeudaDirecta = createAction(
    '[DeudaDirecta] Actualizar DeudaDirecta',
    props<{ deudadirecta: DeudaDirecta }>()
);

export const addDeudaIndirecta = createAction(
    '[DeudaIndirecta] Agregar DeudaIndirecta',
    props<{ deudaindirecta: DeudaIndirecta }>()
);

export const updateDeudaIndirecta = createAction(
    '[DeudaIndirecta] Actualizar DeudaIndirecta',
    props<{ deudaindirecta: DeudaIndirecta }>()
);

export const setSolicitud = createAction(
    '[Solicitud] Set Solicitud de Credito',
    props<{ solicitud: Solicitud }>()
);

export const cleanFlujoCaja = createAction(
    '[FlujoCaja] Limpiar FlujoCaja'
)

export const setFlujoCaja = createAction(
    '[FlujoCaja] Set FlujoCaja',
    props<{ flujocaja: FlujoCaja }>()
)

export const setEsfaTree = createAction(
    '[FlujoCaja] Set EsfaTree',
    props<{ esfaTree: FlujoCajaESFA[] }>()
)

export const setEraTree = createAction(
    '[ERA] Set EraTree',
    props<{ eraTree: FlujoCajaERA[] }>()
)

export const setFlujoCajaDetalleTree = createAction(
    '[FCD] Set FlujoCajaDetalleTree',
    props<{ fcDetalleTree: FlujoCajaDetalle[] }>()
)
export const setHojaTrabajo = createAction(
    '[HT] Set Data Hoja de Trabajo',
    props<{ hojaTrabajo: FlujoCajaHT[] }>()
  )
  