import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Personal } from '../components/models/personal.interface';

@Injectable({
  providedIn: 'root'
})
export class PersonalService {

  UrlPersonal:string = environment.UrlBase_SPCAPI + "personal/";
  constructor(private http: HttpClient) { }

  getPersonal(nroDocumento:string){
    let params = new HttpParams()
                    .append("nroDocumento", nroDocumento);
    return this.http.get<Personal>(this.UrlPersonal, {params});
  }
}
