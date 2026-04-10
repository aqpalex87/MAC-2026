import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TipoClienteService {
  getData() {
    return [
      {
        id: '01',
        descripcion: 'Número de Meses',
        parametro: 36,
        comentarios: '',
      },
      {
        id: '02',
        descripcion: 'Número de Creditos',
        parametro: 1,
        comentarios: '',
      },
    ];
  }

  constructor(private http: HttpClient) {}

  getTipoClienteMini() {
    return Promise.resolve(this.getData().slice(0, 5));
  }

  getTipoClienteSmall() {
    return Promise.resolve(this.getData().slice(0, 10));
  }

  getTipoClienteMedium() {
    return Promise.resolve(this.getData().slice(0, 50));
  }

  getTipoClienteLarge() {
    return Promise.resolve(this.getData().slice(0, 200));
  }

  getTipoClienteXLarge() {
    return Promise.resolve(this.getData());
  }
}
