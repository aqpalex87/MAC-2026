import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RolCrud, RolPaginadoResponse } from '../models/rol-crud.interface';
import { SecurityService } from './security.service';

@Injectable({ providedIn: 'root' })
export class RolAdminService {
  private readonly controller = `${environment.UrlBase_MACAPI}/roles`;

  constructor(private http: HttpClient, private securityService: SecurityService) {}

  obtenerPaginado(idEmpresa: number | null, nombre: string, pageNumber: number, pageSize: number): Observable<RolPaginadoResponse> {
    let params = new HttpParams()
      .set('nombre', nombre ?? '')
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    if (idEmpresa && idEmpresa > 0) {
      params = params.set('idEmpresa', idEmpresa.toString());
    }
    return this.http.get<RolPaginadoResponse>(this.controller, { params, headers: this.getHeaders() });
  }

  crear(data: RolCrud): Observable<RolCrud> {
    return this.http.post<RolCrud>(this.controller, data, { headers: this.getHeaders() });
  }

  actualizar(idRol: number, data: RolCrud): Observable<RolCrud> {
    return this.http.put<RolCrud>(`${this.controller}/${idRol}`, data, { headers: this.getHeaders() });
  }

  eliminar(idRol: number): Observable<{ eliminado: boolean }> {
    return this.http.delete<{ eliminado: boolean }>(`${this.controller}/${idRol}`, { headers: this.getHeaders() });
  }

  private getHeaders(): HttpHeaders {
    const token = this.securityService.leerTokenMAC();
    return new HttpHeaders({
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    });
  }
}
