import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CicloCrud, CicloPaginadoResponse } from '../models/ciclo-crud.interface';
import { SecurityService } from './security.service';

@Injectable({ providedIn: 'root' })
export class CicloAdminService {
  private readonly controller = `${environment.UrlBase_MACAPI}/ciclos`;

  constructor(private http: HttpClient, private securityService: SecurityService) {}

  obtenerPaginado(
    idEmpresa: number | null,
    idSede: number | null,
    nombre: string,
    pageNumber: number,
    pageSize: number
  ): Observable<CicloPaginadoResponse> {
    let params = new HttpParams()
      .set('nombre', nombre ?? '')
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    if (idEmpresa && idEmpresa > 0) {
      params = params.set('idEmpresa', idEmpresa.toString());
    }
    if (idSede && idSede > 0) {
      params = params.set('idSede', idSede.toString());
    }
    return this.http.get<CicloPaginadoResponse>(this.controller, { params, headers: this.getHeaders() });
  }

  crear(data: CicloCrud): Observable<CicloCrud> {
    return this.http.post<CicloCrud>(this.controller, data, { headers: this.getHeaders() });
  }

  actualizar(idCiclo: number, data: CicloCrud): Observable<CicloCrud> {
    return this.http.put<CicloCrud>(`${this.controller}/${idCiclo}`, data, { headers: this.getHeaders() });
  }

  eliminar(idCiclo: number): Observable<{ eliminado: boolean }> {
    return this.http.delete<{ eliminado: boolean }>(`${this.controller}/${idCiclo}`, { headers: this.getHeaders() });
  }

  private getHeaders(): HttpHeaders {
    const token = this.securityService.leerTokenMAC();
    return new HttpHeaders({
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    });
  }
}
