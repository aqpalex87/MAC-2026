import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message, MessageService } from 'primeng/api';
import { SolicitudCredito, SolicitudCreditoFiltro } from 'src/app/models/solicitudCredito.interface';
import { SolicitudCreditoService } from 'src/app/services/solicitud-credito.service';
import { GlobalConstants } from 'src/app/shared/common/globalContants';
import { LoadingService } from 'src/app/services/comun/loading.service';
import { FlujoCajaFC } from 'src/app/models/solicitudesFlujoCaja';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { DatosFC } from 'src/app/models/dataseguridad.interface';
import { SecurityService } from 'src/app/services/security.service';

import * as FlujoCajaActions from 'src/app/redux/actions/flujo-caja/flujo.caja.actions';
import * as FlujoCajaDedudaDPIActions from 'src/app/redux/actions/flujo-caja/deuda.dpi.actions';
import * as FlujoCajaDedudaDPDActions from 'src/app/redux/actions/flujo-caja/deuda.dpd.actions';
import * as FlujoCajaESFAActions from 'src/app/redux/actions/flujo-caja/esfa.actions';
import * as FlujoCajaERAActions from 'src/app/redux/actions/flujo-caja/era.actions';
import * as FlujoCajaGUFActions from 'src/app/redux/actions/flujo-caja/guf.actions';
import * as FlujoCajaRSEActions from 'src/app/redux/actions/flujo-caja/rse.actions';
import * as FlujoCajaRatiosActions from 'src/app/redux/actions/flujo-caja/ratios.actions';

import * as FlujoCajaPDRActions from 'src/app/redux/actions/flujo-caja/pdr.actions';


@Component({
  selector: 'app-solicitud-credito-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.css'],
  providers: [MessageService]
})

export class SolicitudCreditoConsultaComponent implements OnInit {
  //Campos de información
  data: SolicitudCredito[] = [];
  filtro: SolicitudCreditoFiltro;
  mensajes: Message[] = [];
  loading: boolean = false;
  flagRefresh: boolean = true;
  constructor(
    private store: Store<AppState>,
    private messageService: MessageService,
    private solicitudCreditoService: SolicitudCreditoService,
    private router: Router,
    private loadingService: LoadingService,
    private securityService: SecurityService,
  ) { }

  ngOnInit(): void {

this.limpiarFC();
    this.filtro = {
      idFlujoCaja: "",
      numeroSolicitud: "",
      numeroDocumento: "",
      nombres: "",
    };
  }

  buscar(): void {
    try {
      if (this.validarFiltro()) {
        this.loadingService.loading(true);
        this.obtenerSolicitudesCredito();
        this.actualizarVisibilidad();
      }
      else {
        this.mostrarMensaje("warn", "", "Ingrese al menos un criterio de búsqueda.");
      }
    }
    catch {
      this.mostrarMensaje("error", "Error", "Su solicitud no pudo ser completada.");
      this.loadingService.loading(false);
    }
  }

  actualizarVisibilidad(): void {
    this.flagRefresh = false;
    setTimeout(() => this.flagRefresh = true, 0);
  }

  mostrarMensaje(tipomensaje: string, resumen: string, mensaje: string) {
    this.mensajes = [{ severity: tipomensaje, summary: resumen, detail: mensaje }];
    setTimeout(() => {
      this.mensajes = []
    }, 3500);
  }


  validarFiltro(): boolean {
    return (+this.filtro.idFlujoCaja > 0 ||
      +this.filtro.numeroSolicitud > 0 ||
      this.filtro.numeroDocumento?.trim() != "" ||
      this.filtro.nombres?.trim() != "");
  }

  obtenerSolicitudesCredito(): void {
    this.solicitudCreditoService
      .obtenerSolicitudesCredito(this.obtenerFiltroRequest())
      .subscribe((response: SolicitudCredito[]) => {
        this.data = response;
        this.loadingService.loading(false);
      },
        err => {
          this.mostrarMensaje("error", "Error", "Su solicitud no pudo ser completada.");
          this.loadingService.loading(false);
        });
  }

  obtenerFiltroRequest(): SolicitudCreditoFiltro {
    const filtroRequest: SolicitudCreditoFiltro = {
      idFlujoCaja: (+this.filtro.idFlujoCaja > 0 ? this.filtro.idFlujoCaja : "0"),
      numeroSolicitud: (+this.filtro.numeroSolicitud > 0 ? this.filtro.numeroSolicitud : "0"),
      numeroDocumento: this.filtro.numeroDocumento,
      nombres: this.filtro.nombres,
    };
    return filtroRequest;
  }

  obtenerDescripcionEstadoFlujoCaja(estadoFlujoCaja: string): string {
    if (estadoFlujoCaja == GlobalConstants.FlujoCajaPendiente) {
      return GlobalConstants.FlujoCajaPendienteDescripcion;
    }
    else if (estadoFlujoCaja == GlobalConstants.FlujoCajaFinalizado) {
      return GlobalConstants.FlujoCajaFinalizadoDescripcion;
    }
    else if (estadoFlujoCaja == GlobalConstants.FlujoCajaObservado) {
      return GlobalConstants.FlujoCajaObservadoDescripcion;
    }
    else {
      return GlobalConstants.FlujoCajaNoDefinidoDescripcion;
    }
  }

  verificarBotonEdicion(solicitudCredito: SolicitudCredito): boolean {
    return solicitudCredito.estadoFlujoCaja == GlobalConstants.FlujoCajaObservado ||
      solicitudCredito.estadoFlujoCaja == GlobalConstants.FlujoCajaPendiente;
  }

  verificarBotonVerDetalle(solicitudCredito: SolicitudCredito): boolean {
    return solicitudCredito.idFlujoCaja > 0;
  }

  verificarBotonNuevo(solicitudCredito: SolicitudCredito): boolean {
    return solicitudCredito.idFlujoCaja <= 0;
  }

  verDetalleFC(objeto: FlujoCajaFC) {
    let datos: DatosFC = {
      idFlujoCaja: objeto.idFlujoCaja,
      modo: 'DETALLE',
      numeroDocumento: objeto.numeroDocumento,
      numeroSolicitud: objeto.numeroSolicitud,
      vista: 'FC'
    }
    this.securityService.guardarDatosFC(datos);
    if (objeto.idFlujoCaja > 0) {
      this.router.navigateByUrl('/flujocaja');
    }
  }


  editarFC(objeto: FlujoCajaFC) {
    this.loadingService.loading(true);

    let datos: DatosFC = {
      idFlujoCaja: objeto.idFlujoCaja,
      modo: 'EDITAR',
      numeroDocumento: objeto.numeroDocumento,
      numeroSolicitud: objeto.numeroSolicitud,
      vista: 'FC'
    }
    this.securityService.guardarDatosFC(datos);
    if (objeto.idFlujoCaja > 0) {
      this.router.navigateByUrl('/flujocaja');
    }
  }

  crearFC(objeto: FlujoCajaFC) {
    let datos: DatosFC = {
      idFlujoCaja: objeto.idFlujoCaja,
      modo: 'NUEVO',
      numeroDocumento: objeto.numeroDocumento,
      numeroSolicitud: objeto.numeroSolicitud,
      vista: 'FC'
    }
    this.securityService.guardarDatosFC(datos);
    this.router.navigateByUrl('/flujocaja');
  }
  
  limpiarFC(){
    // this.store.dispatch(FlujoCajaActions.cleanFlujoCaja());
    this.store.dispatch(FlujoCajaRSEActions.cleanRSE()); 
    this.store.dispatch(FlujoCajaGUFActions.cleanTablaGuf()); 
    this.store.dispatch(FlujoCajaERAActions.cleanTablaEra());  
    this.store.dispatch(FlujoCajaESFAActions.cleanTablaEsfa()); 

    this.store.dispatch(FlujoCajaDedudaDPDActions.cleanDeudaDirecta());
    this.store.dispatch(FlujoCajaDedudaDPIActions.cleanDeudaIndirecta());
    this.store.dispatch(FlujoCajaRatiosActions.cleanRatios());
    this.store.dispatch(FlujoCajaPDRActions.cleanDPR());
  }
}
