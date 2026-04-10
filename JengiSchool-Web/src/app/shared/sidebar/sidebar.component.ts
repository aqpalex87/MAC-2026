import { Component, EventEmitter, OnInit } from '@angular/core';
import { DomService } from 'src/app/services/dom.service';
import { SecurityService } from 'src/app/services/security.service';
import { AuthSubjectService } from 'src/app/services/subjects/auth-subject.service';
import { Modulo } from '../../models/modulo.interface';
declare var $: any;
declare var M: any;
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  ListaOpciones: any[] = [];
  SecurityModulos: any[] = [];
  isLoaded: boolean = false;

  constructor(
    public domService: DomService,
    public _securityService: SecurityService,
    private authSubjectService: AuthSubjectService
  ) {
    //$('body').on('click', '.sidenav-overlay', this.domService.HideSideBar);
  }

  ngOnInit() {

    this.authSubjectService.isUserLoaded$.subscribe(value => {
      if (value) {
        this.isLoaded = true;
        this.modulos();
      }
    });

    setTimeout(() => {
      if (!this.isLoaded && localStorage.getItem('idperfil') != null && localStorage.getItem('UsuarioWeb') != null) {
        this.modulos();
      }
    }, 2500);
  }

  public modulos() {
    this.inicializarControles();
    this.inicializarEventos();

    this._securityService.obtenerModulos().subscribe((result: any) => {
      this.SecurityModulos = result.response as Modulo[];
      this._securityService.descripcionPerfil$.emit(this.SecurityModulos[0].NombrePerfil);
    })

    // this._securityService.descripcionPerfil$.emit(this.SecurityModulos[0].NombrePerfil);  

  }



  inicializarControles(): void {
    // $('.sidenav').sidenav();
    var elems = document.querySelectorAll('.collapsible');
    var instances = M.Collapsible.init(elems, {});
    // $('.collapsible').collapsible();
  }

  sideNavOverlayClick(): void {
    this.domService.HideSideBar();
  }

  inicializarEventos() {
    //$("body").on("click", ".sidenav-overlay", this.sideNavOverlayClick);
  }

  clickSlideOut() {
    this.domService.ShowSideBar();
  }

  filtrarOpcionesPorModulo(IdOpcion: string) {
    this.ListaOpciones = this.SecurityModulos.filter(
      (x) => x.IdRelacion === IdOpcion
    );
    return this.ListaOpciones;
  }

  filtrarTieneOpciones(IdOpcion: string) {
    this.ListaOpciones = this.SecurityModulos.filter(
      (x) => x.IdRelacion === IdOpcion
    );
    return this.ListaOpciones.length;
  }

  obtenerRutaOpcion(Opcion: any) {
    return (Opcion.Controller != null ? Opcion.Controller : '') + (Opcion.Action != null ? '/' + Opcion.Action : '');
  }

}
