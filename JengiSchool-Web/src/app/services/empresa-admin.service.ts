import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EmpresaCrud, EmpresaPaginadoResponse } from '../models/empresa-crud.interface';
import { SecurityService } from './security.service';

@Injectable({ providedIn: 'root' })
export class EmpresaAdminService {
  private readonly controller = `${environment.UrlBase_MACAPI}/empresas`;

  constructor(private http: HttpClient, private securityService: SecurityService) {}

  obtenerPaginado(nombre: string, pageNumber: number, pageSize: number): Observable<EmpresaPaginadoResponse> {
    const params = new HttpParams()
      .set('nombre', nombre ?? '')
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<EmpresaPaginadoResponse>(this.controller, { params, headers: this.getHeaders() });
  }

  crear(data: EmpresaCrud): Observable<EmpresaCrud> {
    return this.http.post<EmpresaCrud>(this.controller, data, { headers: this.getHeaders() });
  }

  actualizar(idEmpresa: number, data: EmpresaCrud): Observable<EmpresaCrud> {
    return this.http.put<EmpresaCrud>(`${this.controller}/${idEmpresa}`, data, { headers: this.getHeaders() });
  }

  eliminar(idEmpresa: number): Observable<{ eliminado: boolean }> {
    return this.http.delete<{ eliminado: boolean }>(`${this.controller}/${idEmpresa}`, { headers: this.getHeaders() });
  }

  private getHeaders(): HttpHeaders {
    const token = this.securityService.leerTokenMAC();
    return new HttpHeaders({
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    });
  }
}
