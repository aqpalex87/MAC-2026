import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomService } from 'src/app/services/dom.service';
import { SecurityService } from 'src/app/services/security.service';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
declare var $:any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [SidebarComponent]
})
export class HomeComponent implements OnInit {

  SecurityModulos: any[] = [];
  ArrModulos: any[] = [];
  ArrOpciones: any[] = [];
  loginStatus: any;

  ArrColores: any = [
    "teal",
    "red",
    "orange",
    "blue"
  ]
  loading:boolean;
  constructor(
    private _securityService: SecurityService,
    private router: Router,
    private sidebar: SidebarComponent,
    private domService: DomService
  ) { }

  ngOnInit(): void {
        this.CargarModulos(); 
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 5000);
    $("body").addClass("menu-open");
  }

  CargarModulos() {
    this.domService.ShowLoading();
    this.SecurityModulos = this._securityService.leerModulos();;
    this.ArrModulos = this.SecurityModulos.filter(x => x.TipoOpcion == 1);
    setTimeout(() => {
      this.domService.HideLoading();
    }, 3000);

  }


  filtrarOpcionesPorModulo(IdOpcion: string) {
    this.ArrOpciones = this.SecurityModulos.filter(
      (x) => x.IdRelacion === IdOpcion
    );

    return this.ArrOpciones;
  }
  filtrarOpcionesPorModuloSinOpcion(IdOpcion: string) {
    this.ArrOpciones = [];
    let opciones = this.SecurityModulos.filter(
      (x) => x.IdRelacion === IdOpcion
    );
    if (opciones.length == 0) {
      this.ArrOpciones = this.SecurityModulos.filter(x => x.IdOpcion = IdOpcion && x.TipoOpcion == 1);
    }

    return this.ArrOpciones;
  }

  filtrarTieneOpciones(IdOpcion: string) {
    this.ArrOpciones = this.SecurityModulos.filter(
      (x) => x.IdRelacion === IdOpcion
    );
    return this.ArrOpciones.length;
  }

  navigate(Opcion: any) {
    this.router.navigate([`/${Opcion.Controller}/${Opcion.Action}`]);
  }

  navigateModulo(Opcion: any){
    this.router.navigate([`/${Opcion}`]);
  }

}
