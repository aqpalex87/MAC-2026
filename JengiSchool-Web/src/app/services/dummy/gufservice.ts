import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class GUFService {
  getData() {
    return [
      {
        id: '01',
        descripcionUnidadFamiliar: 'Canasta Básica Familiar',
        estado: 'Activo',
        activar: true
      },
      {
        id: '02',
        descripcionUnidadFamiliar: 'Educación',
        estado: 'Activo',
        activar: true
      },
      {
        id: '03',
        descripcionUnidadFamiliar: 'Transporteeeeesss',
        estado: 'Activo',
        activar: true
      },
      {
        id: '04',
        descripcionUnidadFamiliar: 'Agua',
        estado: 'Activo',
        activar: true
      },
      {
        id: '05',
        descripcionUnidadFamiliar: 'Luz',
        estado: 'Activo',
        activar: true
      },
      {
        id: '06',
        descripcionUnidadFamiliar: 'Teléfono Fijo',
        estado: 'Activo',
        activar: true
      },
      {
        id: '07',
        descripcionUnidadFamiliar: 'Teléfono Celular',
        estado: 'Activo',
        activar: true
      },
      {
        id: '08',
        descripcionUnidadFamiliar: 'Combustible',
        estado: 'Activo',
        activar: true
      },
      {
        id: '09',
        descripcionUnidadFamiliar: 'Cable TV',
        estado: 'Activo',
        activar: false
      },
      {
        id: '10',
        descripcionUnidadFamiliar: 'Otros',
        estado: 'Activo',
        activar: false
      },
      {
        id: '11',
        descripcionUnidadFamiliar: 'Créditos Hipotecariossss',
        estado: 'Activo',
        activar: false
      }
    ];
  }

  constructor(private http: HttpClient) {}

  getGUFMini() {
    return Promise.resolve(this.getData().slice(0, 5));
  }

  getGUFSmall() {
    return Promise.resolve(this.getData().slice(0, 10));
  }

  getGUFMedium() {
    return Promise.resolve(this.getData().slice(0, 50));
  }

  getGUFLarge() {
    return Promise.resolve(this.getData().slice(0, 200));
  }

  getGUFXLarge() {
    return Promise.resolve(this.getData());
  }
}