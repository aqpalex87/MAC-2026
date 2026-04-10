import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class ObservableService{
    setPerfil$: Observable<any>;
    private setPerfil: Subject<any> = new Subject();

    constructor() {
        this.setPerfil$ = this.setPerfil.asObservable();
      }

      public setPerfilPagina(perfil:string) {
        this.setPerfil.next(perfil);
      }

}