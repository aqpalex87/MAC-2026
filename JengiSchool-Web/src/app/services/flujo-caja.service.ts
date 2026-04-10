import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppService } from '../app.service';
import { SecurityService } from './security.service';
import { environment } from 'src/environments/environment';
import { Observable, map, of, tap } from 'rxjs';
import { Anio, DeudaDirecta, FlujoCaja, FlujoCajaFiltro } from '../models/flujocaja.interface';
import { ActualizarRevisarFC, SolicitudRevisarFCFiltro } from '../models/solicitudesFlujoCaja';


@Injectable({ providedIn: 'root' })
export class FlujoCajaService extends AppService {

  urlBaseMacApi = environment.UrlBase_MACAPI;
  controller = '/FlujoCaja';

  constructor(securityService: SecurityService, private http: HttpClient) {
    super(securityService);
  }


  obtenerFlujoCajaItems() {
    //return this.http.get(environment.UrlBase_MACAPI + "/Itemsflujocaja/03344167"); //data completa del arbol
    return this.http.get(environment.UrlBase_MACAPI + "/FlujoCaja/16");
  }

  // obtenerAnioMesFlujoCajaAnterior() {
  //   return of("DIC - 22");
  // }

  getDeuda(deudaDirecta: DeudaDirecta) {
    return this.http.post<DeudaDirecta>(this.urlBaseMacApi + this.controller, deudaDirecta);
  }

  obtenerFlujosCaja(filtro: FlujoCajaFiltro) {
    const uri = environment.UrlBase_MACAPI + "/FlujoCaja/obtener";
    return this.http.post(uri, filtro);
  }

  obtenerFlujoCajaById(id: number, nroDocumento: string, nroSolicitud: number, vista: string) {
    return this.http.get(environment.UrlBase_MACAPI + this.controller + "/" + id + "/" + nroDocumento + "/" + nroSolicitud + "/" + vista);
  }

  guardarFlujoCaja(form: any) {
    return this.http.post(this.urlBaseMacApi + this.controller, form);
  }

  editarFlujoCaja(form: any) {
    return this.http.put(this.urlBaseMacApi + this.controller + "/editar", form);
  }

  finalizarFlujoCaja(form: any, idFc: any) {
    return this.http.put(this.urlBaseMacApi + this.controller + "/" + idFc + "/finalizar", form);
  }

  descargarReporteFC(inicio, fin): Observable<any> {
    const url = `${environment.UrlBase_MACAPI}/reportes/reporte-fc/${inicio}/${fin}`;
    return this.http.get(url, { observe: "response", responseType: 'blob' });
  }

  actualizarSolicitudRevisarFC(idFc: number, filtro: ActualizarRevisarFC) {
    const uri = `${environment.UrlBase_MACAPI}/FlujoCaja/${idFc}/revisar`;
    return this.http.put(uri, filtro.comment);
  }

  descargarArchivo(idFC: number): Observable<any> {
    const url = `${environment.UrlBase_MACAPI}/reportes/obtener/${idFC}`;
    return this.http.get(url, { observe: "response", responseType: 'blob' });
  }

  obtenerAniosFromFC(): Observable<any> {
    const url = `${environment.UrlBase_MACAPI}/reportes/anios`;
    return this.http.get(url).pipe(
      map((data: []) => {
        const anios: Anio[] = [];
        data.forEach(element => {
          anios.push({ code: element });
        });
        return anios;
      })
    );
  }
}
