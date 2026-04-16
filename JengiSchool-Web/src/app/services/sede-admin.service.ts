import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SedeCrud, SedePaginadoResponse } from '../models/sede-crud.interface';
import { SecurityService } from './security.service';

@Injectable({ providedIn: 'root' })
export class SedeAdminService {
  private readonly controller = `${environment.UrlBase_MACAPI}/sedes`;

  constructor(private http: HttpClient, private securityService: SecurityService) {}

  obtenerPorEmpresa(idEmpresa: number): Observable<SedeCrud[]> {
    return this.http.get<SedeCrud[]>(`${this.controller}/empresa/${idEmpresa}`, { headers: this.getHeaders() });
  }

  obtenerPaginado(idEmpresa: number | null, nombre: string, pageNumber: number, pageSize: number): Observable<SedePaginadoResponse> {
    let params = new HttpParams()
      .set('nombre', nombre ?? '')
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    if (idEmpresa && idEmpresa > 0) {
      params = params.set('idEmpresa', idEmpresa.toString());
    }
    return this.http.get<SedePaginadoResponse>(this.controller, { params, headers: this.getHeaders() });
  }

  crear(data: SedeCrud): Observable<SedeCrud> {
    return this.http.post<SedeCrud>(this.controller, data, { headers: this.getHeaders() });
  }

  actualizar(idSede: number, data: SedeCrud): Observable<SedeCrud> {
    return this.http.put<SedeCrud>(`${this.controller}/${idSede}`, data, { headers: this.getHeaders() });
  }

  eliminar(idSede: number): Observable<{ eliminado: boolean }> {
    return this.http.delete<{ eliminado: boolean }>(`${this.controller}/${idSede}`, { headers: this.getHeaders() });
  }

  private getHeaders(): HttpHeaders {
    const token = this.securityService.leerTokenMAC();
    return new HttpHeaders({
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    });
  }
}
