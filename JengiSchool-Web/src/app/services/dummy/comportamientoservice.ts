import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ComportamientoService {
  getData() {
    return [
      {
        id: '01',
        comportamientoTipoCliente: 'Nuevo',
        descripcion:
          'Clasificacion SBS 100% Normal <br> Sin clasificacion en los ultimos 6 meses <br> - No ha tenido ningun credito <br> Su ultimo credito cancelado fue hace 36 meses',
        comentarios: '',
      },
      {
        id: '02',
        comportamientoTipoCliente: 'Recurrente',
        descripcion:
          'Clasificacion SBS 100% Normal + %CPP=100% en los ultimos 3 meses donde su <br> clasificacion en otras instituciones financieras debe ser S/C o 100% Normal <br> - Clasificación interna: Hasta CPP en los ultimos 3 meses de informacion historicamente',
        comentarios: '',
      },
    ];
  }

  constructor(private http: HttpClient) {}

  getComportamientoMini() {
    return Promise.resolve(this.getData().slice(0, 5));
  }

  getComportamientoSmall() {
    return Promise.resolve(this.getData().slice(0, 10));
  }

  getComportamientoMedium() {
    return Promise.resolve(this.getData().slice(0, 50));
  }

  getComportamientoLarge() {
    return Promise.resolve(this.getData().slice(0, 200));
  }

  getComportamientoXLarge() {
    return Promise.resolve(this.getData());
  }
}
