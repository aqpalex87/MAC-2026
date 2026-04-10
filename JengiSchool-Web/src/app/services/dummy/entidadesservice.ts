import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class EntidadesService {
  getData() {
    return [
      {
        id: '01',
        nombreEntidad: 'CIMA',
        abreviatura: 'IBK',
        estado: 'Activo',
        activar: true
      },
      {
        id: '02',
        nombreEntidad: 'Banco Continental BBVA',
        abreviatura: 'BBVA',
        estado: 'Activo',
        activar: true
      },
      {
        id: '03',
        nombreEntidad: 'Caja Arequipa',
        abreviatura: '',
        estado: 'Activo',
        activar: true
      },
      {
        id: '04',
        nombreEntidad: 'Banco Scotibank',
        abreviatura: '',
        estado: 'Activo',
        activar: true
      },
      {
        id: '05',
        nombreEntidad: 'CAMAC ICA',
        abreviatura: '',
        estado: 'Inactivo',
        activar: false,
      },
    ];
  }

  constructor(private http: HttpClient) {}

  getEntidadesMini() {
    return Promise.resolve(this.getData().slice(0, 5));
  }

  getEntidadesSmall() {
    return Promise.resolve(this.getData().slice(0, 10));
  }

  getEntidadesMedium() {
    return Promise.resolve(this.getData().slice(0, 50));
  }

  getEntidadesLarge() {
    return Promise.resolve(this.getData().slice(0, 200));
  }

  getEntidadesXLarge() {
    return Promise.resolve(this.getData());
  }
}
