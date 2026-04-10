import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AlertasService {
  getData() {
    return [
      {
        id: '01',
        alerta: 'El efectivo del ESFA es menor a 10000. registrar comentarios correspondientes.',
        calculo: 'Efectivo',
        reglas: 'Menor que',
        parametro: '10000',
        comentario: 'Si el efectivo (proviene ESFA) es menor a 10000. Mostrar alerta "Registrar Comentarios"',
        estado: 'Activo',
        activar: true
      },
      {
        id: '02',
        alerta: 'El efectivo del ESFA es mayor a 10001. registrar adjuntar sustento.',
        calculo: 'Efectivo',
        reglas: 'Mayor que',
        parametro: '10001',
        comentario: 'Si el efectivo (proviene ESFA) es mayor a 10001. Mostrar alerta "Adjuntar Sustento"',
        estado: 'Activo',
        activar: true
      },
      {
        id: '03',
        alerta: 'Condicion RSE "Expuesto"',
        calculo: 'Condicion RSE',
        reglas: 'Igual',
        parametro: 'Espuesto',
        comentario: 'Si la condicion de RSE es "Expuesto" requiere de Excepción por Resultado de RSE sea "Alto"',
        estado: 'Activo',
        activar: true
      },
    ];
  }

  constructor(private http: HttpClient) {}

  getAlertasMini() {
    return Promise.resolve(this.getData().slice(0, 5));
  }

  getAlertasSmall() {
    return Promise.resolve(this.getData().slice(0, 10));
  }

  getAlertasMedium() {
    return Promise.resolve(this.getData().slice(0, 50));
  }

  getAlertasLarge() {
    return Promise.resolve(this.getData().slice(0, 200));
  }

  getAlertasXLarge() {
    return Promise.resolve(this.getData());
  }
}
