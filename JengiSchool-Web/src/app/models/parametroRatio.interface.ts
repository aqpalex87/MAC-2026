import { Estado } from "./estado.enum";
export interface ParametroRatio {
    idParametroRatio: number;
    codigoVersion: string;
    nombreRatio: string;
    regla: string;
    valorParametro: number;
    calculo: string;
    estado: Estado;
}