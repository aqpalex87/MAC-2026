import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppService } from '../app.service';
import { SecurityService } from './security.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class HojaProductoService extends AppService {

    urlBaseMacApi = environment.UrlBase_MACAPI;
    controller = '/HojaProducto';

    constructor(securityService: SecurityService, private http: HttpClient) {
        super(securityService);
    }

    obtenerHojaProductoByUbigeo(ubigeo: string) {
        return this.http.get(environment.UrlBase_MACAPI + this.controller + "/" + ubigeo);
    }

    obtenerHojaProductoByCodigoLaserfiche(idLaserfiche: string): Observable<any> {
        return this.http.get(environment.UrlBase_MACAPI + this.controller + "/downloadFile?codigoLaserfiche=" + idLaserfiche,{ observe: "response", responseType: 'blob'} );
    }
}
