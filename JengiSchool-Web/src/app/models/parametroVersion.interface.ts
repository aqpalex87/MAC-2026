import { ParametroAlerta } from "./parametroAlerta.interface";
import { ParametroComportamiento } from "./parametroComportamiento.interface";
import { ParametroDPD } from "./parametroDPD.interface";
import { ParametroDPI } from "./parametroDPI.interface";
import { ParametroEFI } from "./parametroEFI.interface";
import { ParametroESFA } from "./parametroESFA.interface";
import { ParametroGUF } from "./parametroGUF.interface";
import { ParametroRSECondicion } from "./parametroRSECondicion.interface";
import { ParametroRatio } from "./parametroRatio.interface";
import { ParametroTipoCliente } from "./parametroTipoCliente.interface";

export interface ParametroVersion {
    codigoVersion: string;
    descripcionVersion: string;
    abreviatura: string;
    fechaUltimaActivacion: string;
    fechaUltimaInactivacion: string;
    fechaInactivacion: string;
    fechaRegistro: string;
    usuarioRegistro: string;
    usuarioModificacion: string;
    usuarioUltimaActivacion: string;
    estado: string;
    parametrosEFI: ParametroEFI[];
    parametrosGUF: ParametroGUF[];
    parametrosDPD: ParametroDPD[];
    parametrosDPI: ParametroDPI[];
    parametrosRatio: ParametroRatio[];
    parametrosTipoCliente: ParametroTipoCliente[];
    parametrosRSECondicion: ParametroRSECondicion[];
    parametrosComportamiento: ParametroComportamiento[];
    parametrosAlerta: ParametroAlerta[];
    parametrosESFA: ParametroESFA[];
}