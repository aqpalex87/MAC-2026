import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import { SecurityService } from '../security.service';

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
  constructor(private securityServ:SecurityService) { }

  intercept(request: HttpRequest<null>, next: HttpHandler): Observable<HttpEvent<null>> {
    if(!request.headers.has("Authorization")){
        const token = this.securityServ.leerTokenMAC();
        request = request.clone({
          setHeaders: {
            Authorization: `${token}`,
          },
        });
    }

    return next.handle(request);
  }
}
