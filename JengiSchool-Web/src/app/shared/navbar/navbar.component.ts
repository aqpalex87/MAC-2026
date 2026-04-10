import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ObservableService } from 'src/app/services/ObservableService';
import { DomService } from 'src/app/services/dom.service';
import { SecurityService } from 'src/app/services/security.service';
import { AuthSubjectService } from 'src/app/services/subjects/auth-subject.service';
import $ from 'jquery';

declare var $: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: [ './navbar.component.css' ],
})
export class NavbarComponent implements OnInit {
  MostrarCerrarSesion: boolean = false;
  nombreUsuario!: string;
  descripcionPerfil!: string;
  usuario!: string;
  fechaAcceso!: string;
  perfil!: string;
  agencia!: string;
  private subscripcions: Subscription = new Subscription();
  constructor(private domService: DomService,
    private _securityService: SecurityService,
    private _router: Router,
    private _observableService: ObservableService,
    private _authSubjectService: AuthSubjectService) {

  }

  ngOnInit(): void {

    this.nombreUsuario = this._securityService.leerUsuarioWeb();
    this.usuario = this._securityService.leerUsuarioWeb();
    this.agencia = this._securityService.leerAgencia();
    this.perfil = this._securityService.leerPerfil();
    this.fechaAcceso = new Date().toString();

    this._securityService.descripcionPerfil$.subscribe(perfil => {
      this.perfil = perfil;
    });

    this._authSubjectService.isUserLoaded$.subscribe(val => {
      if (val) {
        this.nombreUsuario = this._securityService.leerUsuarioWeb();
      }
    })

  }

  // MenuOpenClick(): void {
  //   this.domService.ShowSideBar();
  // }

  MenuOpenClick(): void {
    if (this.isMenuOpen())
      this.domService.HideSideBar();
    else
      this.domService.ShowSideBar();
  }

  isMenuOpen(): boolean {
    return $("body").hasClass("menu-open");
  }
}
