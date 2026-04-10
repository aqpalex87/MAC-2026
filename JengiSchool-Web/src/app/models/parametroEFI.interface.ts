import { Estado } from "./estado.enum";
export interface ParametroEFI
{
    idParametroEFI: number;
    codigoVersion: string;
    nombreEFI: string;
    abreviatura: string;
    estado: Estado;
}