import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DPIService {
  getData() {
    return [
      {
        id: '01',
        tipoAval: 'Aval_Mype',
        normal: 2,
        cpp: 20,
        deficiente: 35,
        dudoso: 45,
        perdida: 100,
        tea: 24.6,
        tem: 1.85,
        plazo: 24.0,
        comentario: '',
      },
      {
        id: '02',
        tipoAval: 'Aval_Consumo',
        normal: 3,
        cpp: 30,
        deficiente: 40,
        dudoso: 45,
        perdida: 100,
        tea: 41.70,
        tem: 2.95,
        plazo: 48.0,
        comentario: '',
      },
      {
        id: '03',
        tipoAval: 'Carta_Fianza',
        normal: 1,
        cpp: 5,
        deficiente: 10,
        dudoso: 40,
        perdida: 100,
        tea: 25.0,
        tem: 1.88,
        plazo: 36.00,
        comentario: '',
      },
    ];
  }

  constructor(private http: HttpClient) {}

  getDPIMini() {
    return Promise.resolve(this.getData().slice(0, 5));
  }

  getDPISmall() {
    return Promise.resolve(this.getData().slice(0, 10));
  }

  getDPIMedium() {
    return Promise.resolve(this.getData().slice(0, 50));
  }

  getDPILarge() {
    return Promise.resolve(this.getData().slice(0, 200));
  }

  getDPIXLarge() {
    return Promise.resolve(this.getData());
  }
}
