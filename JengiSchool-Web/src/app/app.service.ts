import { Injectable } from '@angular/core';
import { SecurityService } from './services/security.service';
import { ajax } from 'rxjs/ajax';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  public endpoint = '/';

  constructor(
    public securityService : SecurityService
  ) {}


  public generateHeaders(): any {
    let token = null;

    if (this.securityService.leerTokenSeguridad()) {
      token = this.securityService.leerTokenSeguridad();
    }
    let httpHeaders = null;
    if (token) {

      httpHeaders = {
        'Content-Type': 'application/json',
        'Token': `Bearer ${ token }`
      }

     // httpHeaders = new HttpHeaders({'Content-Type': 'application/json', "Token": 'Bearer ' + token});
    } else {
      httpHeaders = {
        'Content-Type': 'application/json'
      }
    }
    return httpHeaders;
  }

  public generateHeadersMACAPI(): any {
    let token = null;

    if (this.securityService.leerTokenMAC()) {
      token = this.securityService.leerTokenMAC();
    }
    let httpHeaders = null;
    if (token) {

      httpHeaders = {
        'Content-Type': 'application/json',
        'Token': `${ token }`
      }

     // httpHeaders = new HttpHeaders({'Content-Type': 'application/json', "Token": 'Bearer ' + token});
    } else {
      httpHeaders = {
        'Content-Type': 'application/json'
      }
    }
    return httpHeaders;
  }

  get<T>(url: any, type?: any): Observable<any> {
    const headers = this.generateHeadersMACAPI();
    const req = ajax.get(url, headers);
    const data$ = new Observable(observer=> {
      req.subscribe(
        (res)=>{
          observer.next(res);
          observer.complete();
        },
        (err)=>{
          observer.error(err);
        }
      );
    });

    return data$;
  }

  post(url: any, object?: any, type?: any): Observable<any> {
    const headers = this.generateHeadersMACAPI();
    const req = ajax.post(url, object, headers);
    const data$ = new Observable(observer=> {
      req.subscribe(
        (res)=>{
          observer.next(res);
          observer.complete();
        },
        (err)=>{
          observer.error(err);
        }
      );
    });
    return data$;
   // return this.http.post(url, object, {headers, responseType: 'json'});
  }


  put(url: any, object: any, type?: any): Observable<any> {
    const headers = this.generateHeadersMACAPI();
    const req = ajax.put(url, object, headers);
    const data$ = new Observable(observer=> {
      req.subscribe(
        (res)=>{
          observer.next(res);
          observer.complete();
        },
        (err)=>{
          observer.error(err);
        }
      );
    });
    return data$;
   // return this.http.put(url, object, {headers, responseType: type});
  }

  delete(url: any, type?: any): Observable<any> {
    const headers = this.generateHeadersMACAPI();
    const req = ajax.delete(url, headers);
    const data$ = new Observable(observer=> {
      req.subscribe(
        (res)=>{
          observer.next(res);
          observer.complete();
        },
        (err)=>{
          observer.error(err);
        }
      );
    });
    return data$;
    //const headers = this.generateHeaders(type);
    //return this.http.delete(url, {headers, responseType: type});
  }





}
