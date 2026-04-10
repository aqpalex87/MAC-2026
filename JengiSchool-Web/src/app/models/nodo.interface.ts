import { FlujoCajaESFAItem } from "./flujoCajaESFA.interface";

export interface Nodo {
    data: FlujoCajaESFAItem,
    children: Nodo[]
}