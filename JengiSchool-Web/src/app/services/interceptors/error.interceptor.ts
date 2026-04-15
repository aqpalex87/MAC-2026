import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import { DialogService } from '../comun/dialog.service';
import { SecurityService } from '../security.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private dialogService: DialogService,
              private securityService: SecurityService,) { }

  intercept(request: HttpRequest<null>, next: HttpHandler): Observable<HttpEvent<null>> {
    return next.handle(request).pipe(catchError((httpError: HttpErrorResponse) => {
      if(httpError.status == 0){
        this.dialogService.openMsgErrorDialog("El servidor no se encuentra disponible.");
      }
      else if(httpError.status == statusCode.Unauthorized){
        this.dialogService.openMsgErrorDialog("No autorizado: vuelva a iniciar sesion.");
        this.securityService.redirectLogin();
      }
      else if(httpError.status == statusCode.Forbidden){
        this.dialogService.openMsgErrorDialog("Prohibido para el perfil actual.");
      }
      else if(httpError.status == statusCode.InternalServerError){
        this.dialogService.openMsgErrorDialog("Ocurrio un error en el servidor.");
      }
      else if (httpError.status == statusCode.BadRequest || httpError.status == statusCode.NotFound) {
        if(!(httpError.error instanceof Blob)){
          const mensaje = this.getMensaje(httpError);
          this.dialogService.openMsgErrorDialog(mensaje);
        }
      }
      return throwError(() => httpError);
    }));
  }

  private getMensaje(httpError: HttpErrorResponse) {
    let mensaje: string = '';
    let error = typeof httpError.error === 'string'? JSON.parse(httpError.error).errors : httpError.error.errors
    for (let [ , mensajes] of Object.entries<string[]>(error)) {
      mensajes.forEach(m => {
        mensaje += m;
      });
    }
    return mensaje;
  }
}

const statusCode = {
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  InternalServerError: 500
}