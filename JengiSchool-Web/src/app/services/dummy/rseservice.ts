import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class RSEService {
  getData() {
    return [
      {
        id: '01',
        rse: 'C1',
        criterio1: 'OK',
        criterio2: 'OK',
        criterio3: 'OK',
        resultado: 'Bajo',
        condicion: 'No Expuesto',
        comentarios: ''
      },
      {
        id: '02',
        rse: 'C2',
        criterio1: 'OK',
        criterio2: 'OK',
        criterio3: 'NO',
        resultado: 'Alto',
        condicion: 'Expuesto',
        comentarios: ''
      },
      {
        id: '03',
        rse: 'C3',
        criterio1: 'OK',
        criterio2: 'NO',
        criterio3: 'OK',
        resultado: 'Alto',
        condicion: 'Potencialmente Expuesto',
        comentarios: ''
      },
      {
        id: '04',
        rse: 'C4',
        criterio1: 'OK',
        criterio2: 'NO',
        criterio3: 'NO',
        resultado: 'Alto',
        condicion: 'Expuesto',
        comentarios: ''
      },
      {
        id: '05',
        rse: 'C5',
        criterio1: 'NO',
        criterio2: 'OK',
        criterio3: 'OK',
        resultado: 'Medio',
        condicion: 'Expuesto',
        comentarios: ''
      },
      {
        id: '06',
        rse: 'C6',
        criterio1: 'NO',
        criterio2: 'OK',
        criterio3: 'NO',
        resultado: 'Alto',
        condicion: 'Expuesto',
        comentarios: ''
      },
      {
        id: '07',
        rse: 'C7',
        criterio1: 'NO',
        criterio2: 'NO',
        criterio3: 'OK',
        resultado: 'Alto',
        condicion: 'Expuesto',
        comentarios: ''
      },
      {
        id: '08',
        rse: 'C8',
        criterio1: 'NO',
        criterio2: 'NO',
        criterio3: 'NO',
        resultado: 'Alto',
        condicion: 'Expuesto',
        comentarios: ''
      },
    ];
  }

  constructor(private http: HttpClient) {}

  getRSEMini() {
    return Promise.resolve(this.getData().slice(0, 5));
  }

  getRSESmall() {
    return Promise.resolve(this.getData().slice(0, 10));
  }

  getRSEMedium() {
    return Promise.resolve(this.getData().slice(0, 50));
  }

  getRSELarge() {
    return Promise.resolve(this.getData().slice(0, 200));
  }

  getRSEXLarge() {
    return Promise.resolve(this.getData());
  }
}
