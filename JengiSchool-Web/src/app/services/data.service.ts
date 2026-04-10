import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SecurityService } from './security.service';
import { AppService } from '../app.service';
import { ParametroVersion } from '../models/parametroVersion.interface';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataService extends AppService {

  public controller = '/ParametroVersion';
  
  constructor(securityService: SecurityService, private http: HttpClient) {
    super(securityService);
  }

  setData(data:any){
    localStorage.setItem('data', JSON.stringify(data));
  }

  getData(){
    return JSON.parse(localStorage.getItem('data'));
  }

  registrarParametroVersion(parametro: ParametroVersion) {
    return this.http.post(environment.UrlBase_MACAPI + this.controller, parametro);
  }

  obtenerListadoParametros() {
    return this.http.get(environment.UrlBase_MACAPI + this.controller);
  }

  obtenerDetalleParametro(parametro:string){
    return this.http.get(environment.UrlBase_MACAPI + this.controller + '/' + parametro);
  }

  actualizarEstadoParametroVersion(codigoVersion:string, estado: string){
    return this.http.put(environment.UrlBase_MACAPI + this.controller + '/' + codigoVersion + '/' + estado, {});
  }

  obtenerNuevoCodigoVersion(){
    return this.http.get(environment.UrlBase_MACAPI + this.controller + '/' + 'nuevoCodigoVersion');
  }

  obtenerParametrosVersionActiva(parametro:number){
    return this.http.get(environment.UrlBase_MACAPI + this.controller + '/activo' + '/' + parametro);
  }

}
