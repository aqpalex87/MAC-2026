import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CarnetListadoResponse } from '../models/carnet-listado.interface';
import { SecurityService } from './security.service';

@Injectable({ providedIn: 'root' })
export class CarnetAdminService {
  private readonly baseUrl = `${environment.UrlBase_MACAPI}/Carnets`;

  constructor(private http: HttpClient, private securityService: SecurityService) {}

  obtenerListado(
    idEmpresa: number,
    idSede: number | null,
    filtro: string,
    pageNumber: number,
    pageSize: number
  ): Observable<CarnetListadoResponse> {
    let params = new HttpParams()
      .set('idEmpresa', idEmpresa.toString())
      .set('filtro', filtro ?? '')
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    if (idSede && idSede > 0) {
      params = params.set('idSede', idSede.toString());
    }
    return this.http.get<CarnetListadoResponse>(`${this.baseUrl}/listado`, {
      params,
      headers: this.getHeaders(),
    });
  }

  private getHeaders(): HttpHeaders {
    const token = this.securityService.leerTokenMAC();
    return new HttpHeaders({
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    });
  }
}
