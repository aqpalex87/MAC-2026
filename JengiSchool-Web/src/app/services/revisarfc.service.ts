import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppService } from '../app.service';
import { SecurityService } from './security.service';
import { environment } from 'src/environments/environment';
import {
  SolicitudRevisarFCFiltro,
  ActualizarRevisarFC,
} from './../models/solicitudesFlujoCaja';
import { Observable } from 'rxjs';
import { AjaxResponse, ajax } from 'rxjs/ajax';
const APP_CODE = environment.AppCode;
const APP_KEY = environment.AppKey;

@Injectable({ providedIn: 'root' })
export class RevisarfcService extends AppService {
  urlBaseMacApi = environment.UrlBase_MACAPI;
  controller = '/FlujoCaja';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'X-AppKey': `${APP_KEY}`,
      'X-AppCode': `${APP_CODE}`,
    }),
  };

  constructor(securityService: SecurityService, private http: HttpClient) {
    super(securityService);
  }
  obtenerSolicitudesRevisarFC(filtro: SolicitudRevisarFCFiltro) {
    const uri = environment.UrlBase_MACAPI + '/FlujoCaja/obtener';
    return this.http.post(uri, filtro);
  }

  observarCreditoFC(datos: ActualizarRevisarFC) {
    const uri = `${environment.UrlBase_MACAPI}/FlujoCaja/${datos.idf}/revisar`;
    const commentData = { comment: datos.comment };
    return this.http.put(uri, commentData, this.httpOptions);
  }
  actualizarObs(datos: ActualizarRevisarFC) {
    const uri = environment.UrlBase_MACAPI + '/FlujoCaja/actualizar';
    return this.http.post(uri, datos);
  }
}
