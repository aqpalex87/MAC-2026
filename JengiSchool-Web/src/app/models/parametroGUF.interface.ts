import { Estado } from "./estado.enum";
export interface ParametroGUF {
    idParametroGUF: number;
    codigoVersion: string;
    nombreGUF: string;
    editable: number;
    estado: Estado;
}