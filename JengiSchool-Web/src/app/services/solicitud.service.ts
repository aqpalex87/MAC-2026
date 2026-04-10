import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Solicitud } from '../models/solicitud.interface';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {
  urlBaseMacApi = environment.UrlBase_MACAPI;
  controller = '/SolicitudCredito';
  constructor(private http: HttpClient) { }

  getSolicitudCredito(solicitud: Solicitud,vista:string) {
    return this.http.post<Solicitud>(this.urlBaseMacApi + this.controller + '?vista=' + vista, solicitud);
  }

}
