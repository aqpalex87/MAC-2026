import { Estado } from "./estado.enum";

export interface ParametroAlerta {
  idParametroAlerta: number;
  codigoVersion: string;
  nombreAlerta: string;
  calculo: string;
  regla: string;
  valorParametro: number;
  comentario: string;
  estado: Estado;
}
