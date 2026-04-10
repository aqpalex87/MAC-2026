import { createAction, props } from '@ngrx/store';
import { ParametroAlerta } from 'src/app/models/parametroAlerta.interface';
import { ParametroComportamiento } from 'src/app/models/parametroComportamiento.interface';
import { ParametroDPDModal } from 'src/app/models/parametroDPD.interface';
import { ParametroDPIModal } from 'src/app/models/parametroDPI.interface';
import { ParametroESFA } from 'src/app/models/parametroESFA.interface';
import { ParametroRSECondicion } from 'src/app/models/parametroRSECondicion.interface';
import { ParametroTipoCliente } from 'src/app/models/parametroTipoCliente.interface';

export const setParametrosDPD = createAction(
    '[FlujoCaja] Set ParametrosDPD',
    props<{ items: ParametroDPDModal[] }>()
)

export const setParametrosDPI = createAction(
    '[FlujoCaja] Set ParametrosDPI',
    props<{ items: ParametroDPIModal[] }>()
)
export const setParametrosAlerta = createAction(
    '[FlujoCaja] Set ParametrosAlerta',
    props<{ items: ParametroAlerta[] }>()
)

export const setParametrosComportamiento = createAction(
    '[FlujoCaja] Set ParametrosComportameinto',
    props<{ items: ParametroComportamiento[] }>()
)

export const setParametrosTipoCliente = createAction(
    '[FlujoCaja] Set ParametrosTipoCliente',
    props<{ items: ParametroTipoCliente[] }>()
)

export const setParametrosRSECondiciones= createAction(
    '[FlujoCaja] Set ParametrosRSECondiciones',
    props<{ items: ParametroRSECondicion[] }>()
)

export const setParametrosESFA= createAction(
    '[FlujoCaja] Set ParametrosESFA',
    props<{ items: ParametroESFA[] }>()
)



