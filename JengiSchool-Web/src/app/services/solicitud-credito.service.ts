import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppService } from '../app.service';
import { SecurityService } from './security.service';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';
import { SolicitudCreditoFiltro } from '../models/solicitudCredito.interface';


@Injectable({ providedIn: 'root' })
export class SolicitudCreditoService extends AppService {
  
  constructor(securityService: SecurityService, private http: HttpClient) {
    super(securityService);
  }

  obtenerSolicitudesCredito(filtro: SolicitudCreditoFiltro) {
    const uri = environment.UrlBase_MACAPI + "/SolicitudCredito/Obtener";
    return this.http.post(uri, filtro);
  }
}
