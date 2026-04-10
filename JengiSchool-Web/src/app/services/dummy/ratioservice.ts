import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class RatioService {
  getData() {
    return [
      {
        id: '01',
        ratios: 'Sobreendeudamiento',
        regla: 'Max',
        parametro: 70,
        calculo: '[((TCA) + (TCSF) + (TDP))] / (TEXD)',
        estado: 'Activo',
        activar: true,
      },
      {
        id: '02',
        ratios: 'Liquidez',
        regla: 'Min',
        parametro: 1.00,
        calculo: '[Activo_Corriente] / [Pasivo_Corriente]',
        estado: 'Activo',
        activar: true,
      },
      {
        id: '03',
        ratios: 'Capital Trabajo',
        regla: 'Min',
        parametro: 1.00,
        calculo: '[Activo_Corriente] - [Pasivo_Corriente]',
        estado: 'Activo',
        activar: true,
      },
      {
        id: '04',
        ratios: 'Endeudamiento Patrimonio',
        regla: 'Max',
        parametro: 0.80,
        calculo: '[Pasivo_Corriente] + [Pasivo_No_Corriente] / [Patrimonio]',
        estado: 'Activo',
        activar: true,
      },
      {
        id: '05',
        ratios: 'Deuda Total de Activos',
        regla: 'Max',
        parametro: 1.00,
        calculo: '[Pasivo_Corriente] + [Pasivo_No_Corriente] / [Total Activo]',
        estado: 'Activo',
        activar: true,
      },
      {
        id: '06',
        ratios: 'Rentabilidad Sobre el Activo (ROA)',
        regla: 'Max',
        parametro: 0.05,
        calculo: '[Utilidad Neta] / [Total_Activo]',
        estado: 'Activo',
        activar: true,
      },
      {
        id: '07',
        ratios: 'Rentabilidad Sobre el Patrimonio (ROA)',
        regla: 'Min',
        parametro: 0.05,
        calculo: '[Utilidad Neta] / [Patrimonio]',
        estado: 'Activo',
        activar: true,
      },
      {
        id: '08',
        ratios: 'Margen de Ventas',
        regla: 'Min',
        parametro: 0.15,
        calculo: '[Utilidad Neta] / [Ventas Netas]',
        estado: 'Activo',
        activar: true,
      },
    ];
  }

  constructor(private http: HttpClient) {}

  getRatioMini() {
    return Promise.resolve(this.getData().slice(0, 5));
  }

  getRatioSmall() {
    return Promise.resolve(this.getData().slice(0, 10));
  }

  getRatioMedium() {
    return Promise.resolve(this.getData().slice(0, 50));
  }

  getRatioLarge() {
    return Promise.resolve(this.getData().slice(0, 200));
  }

  getRatioXLarge() {
    return Promise.resolve(this.getData());
  }
}
