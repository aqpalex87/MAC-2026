import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AlumnoCrud, AlumnoPaginadoResponse } from '../models/alumno-crud.interface';
import { SecurityService } from './security.service';

@Injectable({ providedIn: 'root' })
export class AlumnoAdminService {
  private readonly controller = `${environment.UrlBase_MACAPI}/alumnos`;

  constructor(private http: HttpClient, private securityService: SecurityService) {}

  obtenerPaginado(
    idEmpresa: number | null,
    idSede: number | null,
    filtro: string,
    pageNumber: number,
    pageSize: number
  ): Observable<AlumnoPaginadoResponse> {
    let params = new HttpParams()
      .set('filtro', filtro ?? '')
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    if (idEmpresa && idEmpresa > 0) {
      params = params.set('idEmpresa', idEmpresa.toString());
    }
    if (idSede && idSede > 0) {
      params = params.set('idSede', idSede.toString());
    }
    return this.http.get<AlumnoPaginadoResponse>(this.controller, { params, headers: this.getHeaders() });
  }

  obtenerPorId(idAlumno: number): Observable<AlumnoCrud> {
    return this.http.get<AlumnoCrud>(`${this.controller}/${idAlumno}`, { headers: this.getHeaders() });
  }

  crear(data: AlumnoCrud): Observable<AlumnoCrud> {
    return this.http.post<AlumnoCrud>(this.controller, data, { headers: this.getHeaders() });
  }

  actualizar(idAlumno: number, data: AlumnoCrud): Observable<AlumnoCrud> {
    return this.http.put<AlumnoCrud>(`${this.controller}/${idAlumno}`, data, { headers: this.getHeaders() });
  }

  eliminar(idAlumno: number): Observable<{ eliminado: boolean }> {
    return this.http.delete<{ eliminado: boolean }>(`${this.controller}/${idAlumno}`, { headers: this.getHeaders() });
  }

  private getHeaders(): HttpHeaders {
    const token = this.securityService.leerTokenMAC();
    return new HttpHeaders({
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    });
  }
}
