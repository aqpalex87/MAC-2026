import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DetalleService {
    getData() {
        return [
            {
                id: 1000,
                versionParametro: 202304003,
                descripcion: 'Directiva Oficio Nro. 089-2023',
                fechaRegistro: '15-04-2023',
                usuarioRegistro: 'JPOMA',
                fechaUltimaActivacion: '15-04-2023',
                usuarioUltimaActivacion: '',
                fechaInactivacion: '15-04-2023',
                activar: true
            },
            {
                id: 1001,
                versionParametro: 202304002,
                descripcion: 'Directiva Oficio Nro. 085-2023',
                fechaRegistro: '09-04-2023',
                usuarioRegistro: 'JPOMA',
                fechaUltimaActivacion: '09-04-2023',
                usuarioUltimaActivacion: '',
                fechaInactivacion: '09-04-2023',
                activar: true
            },
            {
                id: 1002,
                versionParametro: 202304001,
                descripcion: 'Directiva Oficio Nro. 071-2023',
                fechaRegistro: '03-04-2023',
                usuarioRegistro: 'JPOMA',
                fechaUltimaActivacion: '03-04-2023',
                usuarioUltimaActivacion: '',
                fechaInactivacion: '03-04-2023',
                activar: true
            }
        ];
    }

    constructor(private http: HttpClient) {}
    
    getDetalleMini() {
        return Promise.resolve(this.getData().slice(0, 5));
    }

    getDetalleSmall() {
        return Promise.resolve(this.getData().slice(0, 10));
    }

    getDetalleMedium() {
        return Promise.resolve(this.getData().slice(0, 50));
    }

    getDetalleLarge() {
        return Promise.resolve(this.getData().slice(0, 200));
    }

    getDetalleXLarge() {
        return Promise.resolve(this.getData());
    }

};