import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FiltroReporte } from '../components/models/filtroReporte.interface';

@Injectable({
  providedIn: 'root'
})
export class ComunService {

  private urlComun:string = environment.UrlBase_SPCAPI + "comun/";
  constructor(private http: HttpClient) { }

  getFiltrosReporte(){
    return this.http.get<FiltroReporte>(this.urlComun + "filtros-reporte");
  }
}
