import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  AsistenciaListadoItem,
  AsistenciaPaginadoResponse,
  AsistenciaRegistroManualRequest,
  AsistenciaRegistroManualResponse,
} from '../models/asistencia.interface';
import { SecurityService } from './security.service';

@Injectable({ providedIn: 'root' })
export class AsistenciaAdminService {
  private readonly controller = `${environment.UrlBase_MACAPI}/asistencias`;

  constructor(private http: HttpClient, private securityService: SecurityService) {}

  obtenerPaginado(
    dni: string,
    fechaInicio: string | null,
    fechaFin: string | null,
    idParamEvento: number | null,
    pageNumber: number,
    pageSize: number
  ): Observable<AsistenciaPaginadoResponse> {
    let params = new HttpParams()
      .set('dni', dni ?? '')
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    if (fechaInicio) {
      params = params.set('fechaInicio', fechaInicio);
    }
    if (fechaFin) {
      params = params.set('fechaFin', fechaFin);
    }
    if (idParamEvento && idParamEvento > 0) {
      params = params.set('idParamEvento', idParamEvento.toString());
    }
    return this.http.get<AsistenciaPaginadoResponse>(this.controller, { params, headers: this.getHeaders() });
  }

  obtenerParaExportar(
    dni: string,
    fechaInicio: string | null,
    fechaFin: string | null,
    idParamEvento: number | null
  ): Observable<AsistenciaListadoItem[]> {
    let params = new HttpParams().set('dni', dni ?? '');
    if (fechaInicio) {
      params = params.set('fechaInicio', fechaInicio);
    }
    if (fechaFin) {
      params = params.set('fechaFin', fechaFin);
    }
    if (idParamEvento && idParamEvento > 0) {
      params = params.set('idParamEvento', idParamEvento.toString());
    }
    return this.http.get<AsistenciaListadoItem[]>(`${this.controller}/exportar`, { params, headers: this.getHeaders() });
  }

  registrarManual(data: AsistenciaRegistroManualRequest): Observable<AsistenciaRegistroManualResponse> {
    return this.http.post<AsistenciaRegistroManualResponse>(`${this.controller}/manual`, data, { headers: this.getHeaders() });
  }

  private getHeaders(): HttpHeaders {
    const token = this.securityService.leerTokenMAC();
    return new HttpHeaders({
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    });
  }
}
