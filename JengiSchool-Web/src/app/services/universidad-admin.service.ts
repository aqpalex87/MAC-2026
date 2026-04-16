import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UniversidadComboItem, UniversidadCrud, UniversidadDetalleCrud, UniversidadPaginadoResponse } from '../models/universidad-crud.interface';
import { SecurityService } from './security.service';

@Injectable({ providedIn: 'root' })
export class UniversidadAdminService {
  private readonly controller = `${environment.UrlBase_MACAPI}/universidades`;

  constructor(private http: HttpClient, private securityService: SecurityService) {}

  obtenerCombo(idEmpresa: number | null): Observable<UniversidadComboItem[]> {
    let params = new HttpParams();
    if (idEmpresa && idEmpresa > 0) {
      params = params.set('idEmpresa', idEmpresa.toString());
    }
    return this.http.get<UniversidadComboItem[]>(`${this.controller}/combo`, { params, headers: this.getHeaders() });
  }

  obtenerPaginado(idEmpresa: number | null, nombre: string, pageNumber: number, pageSize: number): Observable<UniversidadPaginadoResponse> {
    let params = new HttpParams()
      .set('nombre', nombre ?? '')
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    if (idEmpresa && idEmpresa > 0) {
      params = params.set('idEmpresa', idEmpresa.toString());
    }
    return this.http.get<UniversidadPaginadoResponse>(this.controller, { params, headers: this.getHeaders() });
  }

  obtenerDetalle(idUniversidad: number): Observable<UniversidadDetalleCrud[]> {
    return this.http.get<UniversidadDetalleCrud[]>(`${this.controller}/${idUniversidad}/detalle`, { headers: this.getHeaders() });
  }

  crear(data: UniversidadCrud): Observable<UniversidadCrud> {
    return this.http.post<UniversidadCrud>(this.controller, data, { headers: this.getHeaders() });
  }

  actualizar(idUniversidad: number, data: UniversidadCrud): Observable<UniversidadCrud> {
    return this.http.put<UniversidadCrud>(`${this.controller}/${idUniversidad}`, data, { headers: this.getHeaders() });
  }

  eliminar(idUniversidad: number): Observable<{ eliminado: boolean }> {
    return this.http.delete<{ eliminado: boolean }>(`${this.controller}/${idUniversidad}`, { headers: this.getHeaders() });
  }

  private getHeaders(): HttpHeaders {
    const token = this.securityService.leerTokenMAC();
    return new HttpHeaders({
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    });
  }
}
