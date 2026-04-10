import { ParametroAlerta } from "./parametroAlerta.interface";
import { ParametroComportamiento } from "./parametroComportamiento.interface";
import { ParametroDPDModal } from "./parametroDPD.interface";
import { ParametroDPIModal } from "./parametroDPI.interface";
import { ParametroESFA } from "./parametroESFA.interface";
import { ParametroRSECondicion } from "./parametroRSECondicion.interface";
import { ParametroTipoCliente } from "./parametroTipoCliente.interface";

export interface ParametroVersionFC {
    parametrosDPD? : ParametroDPDModal[];
    parametrosDPI? : ParametroDPIModal[];
    parametrosAlerta?: ParametroAlerta[];
    parametrosComportamiento? : ParametroComportamiento[];
    parametrosTipoCliente? : ParametroTipoCliente[];
    parametrosRSECondicion? : ParametroRSECondicion[];
    parametrosESFA?: ParametroESFA[];
}