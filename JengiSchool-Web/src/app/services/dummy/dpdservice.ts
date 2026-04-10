import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DPDService {
  getData() {
    return [
      {
        id: '01',
        tipoTarjetaLineaCredito: 'T. Consumo con Uso',
        factorConversion: 10,
        plazo: 7,
        tem: 2.95,
        tea: 41.7,
        comentario: 'Comentario ABC',
      },
      {
        id: '02',
        tipoTarjetaLineaCredito: 'T. Consumo sin Uso',
        factorConversion: 5,
        plazo: 36,
        tem: 3.48,
        tea: 50.70,
        comentario: 'Comentario CDE',
      },
      {
        id: '03',
        tipoTarjetaLineaCredito: 'LC Micro Empresa',
        factorConversion: 20,
        plazo: 12,
        tem: 2.38,
        tea: 32.62,
        comentario: 'Comentario XXX',
      },
      {
        id: '04',
        tipoTarjetaLineaCredito: 'LC Pequeña Empresa',
        factorConversion: 20,
        plazo: 24,
        tem: 1.37,
        tea: 17.70,
        comentario: 'Comentario XXX',
      },
    ];
  }

  constructor(private http: HttpClient) {}

  getDPDMini() {
    return Promise.resolve(this.getData().slice(0, 5));
  }

  getDPDSmall() {
    return Promise.resolve(this.getData().slice(0, 10));
  }

  getDPDMedium() {
    return Promise.resolve(this.getData().slice(0, 50));
  }

  getDPDLarge() {
    return Promise.resolve(this.getData().slice(0, 200));
  }

  getDPDXLarge() {
    return Promise.resolve(this.getData());
  }
}
