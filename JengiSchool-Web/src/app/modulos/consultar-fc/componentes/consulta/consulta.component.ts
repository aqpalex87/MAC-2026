import { ActualizarRevisarFC } from 'src/app/models/solicitudesFlujoCaja';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { RevisarfcService } from '../../../../services/revisarfc.service';
import { Router, ActivatedRoute } from '@angular/router';
import {
  openModal,
  closeModal,
} from '../../../../redux/actions/flujo-caja/modal.actions';
import { ModalState } from '../../../../redux/reducers/flujo-caja/modal.reducer';
import { MatDialog } from '@angular/material/dialog';
import { ModalObservarComponent } from './../modal-observar/modal-observar.component';
import { MessageService } from 'primeng/api';

import Swal from 'sweetalert2';
import { SolicitudService } from 'src/app/services/solicitud.service';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { FlujoCajaService } from 'src/app/services/flujo-caja.service';
import { Solicitud } from 'src/app/models/solicitud.interface';
import { CommonData, DestinoCredito, FlujoCaja } from 'src/app/models/flujocaja.interface';
import { AppState } from 'src/app/app.state';
import * as FlujoCajaActions from '../../../../redux/actions/flujo-caja/flujo.caja.actions';
import * as FlujoCajaRatiosActions from '../../../../redux/actions/flujo-caja/ratios.actions';
import * as ComentariosActions from '../../../../redux/actions/flujo-caja/comentarios.actions';
import * as SensibilizacionesActions from '../../../../redux/actions/flujo-caja/sensibilizaciones.actions';
import * as FlujoCajaGUFActions from '../../../../redux/actions/flujo-caja/guf.actions';
import * as FlujoCajaESFAActions from '../../../../redux/actions/flujo-caja/esfa.actions';
import * as FlujoCajaERAActions from '../../../../redux/actions/flujo-caja/era.actions';
import * as FlujoCajaDetalleActions from '../../../../redux/actions/flujo-caja/fcdetalle.actions';
import * as FlujoCajaPDRActions from '../../../../redux/actions/flujo-caja/pdr.actions';
import * as FlujoCajaOCActions from '../../../../redux/actions/flujo-caja/oc.actions';
import * as FlujoCajaRSEActions from '../../../../redux/actions/flujo-caja/rse.actions';
import * as FlujoCajaParametrosActions from '../../../../redux/actions/flujo-caja/parametros.actions';
import * as HojaProductoActions from '../../../../redux/actions/hoja-producto/hoja.producto.actions';
import * as SharedActions from '../../../../redux/actions/shared/shared.actions';
import { SharedESFAService } from 'src/app/services/shared/shared.esfa.service';
import { SharedERAService } from 'src/app/services/shared/shared.era.service';
import { SharedFCDetalleService } from 'src/app/services/shared/shared.fcdetalle.service';
import { SharedRSEService } from 'src/app/services/shared/shared.rse.service';
import { DataService } from 'src/app/services/data.service';
import { LoadingService } from 'src/app/services/comun/loading.service';
import { HojaProductoService } from 'src/app/services/hoja-producto.service';
import { HojaProducto } from 'src/app/models/hojaProducto.interface';
import { DatosFC } from 'src/app/models/dataseguridad.interface';
import { SecurityService } from 'src/app/services/security.service';
import { ParametroVersionFC } from 'src/app/models/parametroVersionFC.interface';
import * as FlujoCajaHPActions from '../../../../redux/actions/flujo-caja/hp.actions';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.css'],
  providers: [MessageService]
})
export class ConsultaComponent implements OnInit {
  datos: DatosFC;
  datosRecibidos: any;
  comment: string = '';
  errorMessage: string = '';
  modalState: ModalState;
  idFlujoCaja: number;
  modo: string;
  solicitud: Solicitud;
  commonData: CommonData = {
    codDestino: '',
    gridTitle: '',
    textButton: ''
  }
  destinoCredito = DestinoCredito;


  constructor(
    public dialog: MatDialog
    , private messageService: MessageService
    , private route: ActivatedRoute
    , private revisarfcsrv: RevisarfcService
    , private router: Router
    , private solicitudSvc: SolicitudService
    , private flujoCajaSvc: FlujoCajaService
    , private store: Store<AppState>
    , private esfaSvc: SharedESFAService
    , private eraSvc: SharedERAService
    , private tablaSvc: SharedFCDetalleService
    , private rseSvc: SharedRSEService
    , private dataSvc: DataService
    , private loadingService: LoadingService
    , private messageSvc: MessageService
    , private hpSvc: HojaProductoService
    , private securityService: SecurityService
  ) {

    // this.store.select('modal').subscribe((state) => {
    //   this.modalState = state;
    // });
  }

  // toggleModal() {
  //   if (this.modalState.isOpen) {
  //     this.closeModal();
  //   } else {
  //     this.store.dispatch(openModal());
  //   }
  // }

  ngOnInit(): void {
    this.loadingService.loading(true);
    // Obtén los datos de la ruta actual
    this.datos = this.securityService.leerDatosFC();
    // Verifica si se han recibido datos
    if (this.datos) {
      this.idFlujoCaja = this.datos.idFlujoCaja;
      // Aquí puedes utilizar los datos como desees en tu componente
      this.store.dispatch(SharedActions.setModoFC({ isEditableFC: false }));
      let solicitudCredito: Solicitud = {
        numeroSolicitud: this.datos.numeroSolicitud,
        numeroDocumento: this.datos.numeroDocumento
      };

      forkJoin([
        this.solicitudSvc.getSolicitudCredito(solicitudCredito,this.datos.vista),
        this.flujoCajaSvc.obtenerFlujoCajaById(this.idFlujoCaja, this.datos.numeroDocumento, this.datos.numeroSolicitud, this.datos.vista),
        this.dataSvc.obtenerParametrosVersionActiva(this.idFlujoCaja)
      ]).subscribe({
        next: response => {

          try {

            this.solicitud = response[0];
            this.commonData.codDestino = this.solicitud.codDestino;

            let flujocaja: FlujoCaja = response[1];
            if (this.solicitud.codHP == null || this.solicitud.codHP < 0) {
              let listHP = flujocaja.flujoCajaHP;
              listHP.forEach(hp => {
                switch (hp.codItem) {
                  case "HPCOST":
                    this.solicitud.hpCosto = hp.monto;
                    flujocaja.hpCosto = hp.monto;
                    break;
                  case "HPPREC":
                    this.solicitud.hpPrecio = hp.monto;
                    flujocaja.hpPrecio = hp.monto;
                    break;
                  case "HPREND":
                    this.solicitud.hpRendimiento = hp.monto
                    flujocaja.hpRendimiento = hp.monto
                    break;
                }
              });
            } else {
              flujocaja.hpCosto = this.solicitud.hpCosto;
              flujocaja.hpPrecio = this.solicitud.hpPrecio;
              flujocaja.hpRendimiento = this.solicitud.hpRendimiento;
            }

            this.store.dispatch(FlujoCajaActions.setSolicitud({ solicitud: this.solicitud }));

            let parametrosFC: ParametroVersionFC = response[2];
            this.store.dispatch(FlujoCajaParametrosActions.setParametrosDPD({ items: parametrosFC.parametrosDPD }));
            this.store.dispatch(FlujoCajaParametrosActions.setParametrosDPI({ items: parametrosFC.parametrosDPI }));
            this.store.dispatch(FlujoCajaParametrosActions.setParametrosAlerta({ items: parametrosFC.parametrosAlerta }));
            this.store.dispatch(FlujoCajaParametrosActions.setParametrosComportamiento({ items: parametrosFC.parametrosComportamiento }));
            this.store.dispatch(FlujoCajaParametrosActions.setParametrosTipoCliente({ items: parametrosFC.parametrosTipoCliente }));
            this.store.dispatch(FlujoCajaParametrosActions.setParametrosRSECondiciones({ items: parametrosFC.parametrosRSECondicion }))
            this.store.dispatch(FlujoCajaParametrosActions.setParametrosESFA({ items: parametrosFC.parametrosESFA }))

            this.cargarDatosHP(this.solicitud.ubigeoDep);

            this.store.dispatch(FlujoCajaActions.setFlujoCaja({ flujocaja }));
            this.store.dispatch(FlujoCajaRatiosActions.setRatios({ items: flujocaja.ratios }));

            this.store.dispatch(ComentariosActions.setComentarioGUF({ comentarioGuf: flujocaja.comentarioGuf }));
            this.store.dispatch(ComentariosActions.setComentarioESFA({ comentarioEsfa: flujocaja.comentarioEsfa }));
            this.store.dispatch(ComentariosActions.setComentarioERA({ comentarioEra: flujocaja.comentarioEra }));
            this.store.dispatch(ComentariosActions.setComentarioFCD({ comentarioFcd: flujocaja.comentarioFcd }));
            this.store.dispatch(ComentariosActions.setComentarioRSE({ comentarioRse: flujocaja.comentarioRse }));

            this.store.dispatch(SensibilizacionesActions.setSensibilizacionesPrecioPromedio({ precioPromedio: flujocaja.precioPromedio }));
            this.store.dispatch(SensibilizacionesActions.setSensibilizacionesRendimientoPromedio({ rendimientoPromedio: flujocaja.rendimientoPromedio }));
            this.store.dispatch(SensibilizacionesActions.setSensibilizacionesSvCosto({ svCosto: flujocaja.svCosto }));
            this.store.dispatch(SensibilizacionesActions.setSensibilizacionesSvPrecio({ svPrecio: flujocaja.svPrecio }));
            this.store.dispatch(SensibilizacionesActions.setSensibilizacionesSvRendimiento({ svRendimiento: flujocaja.svRendimiento }));

            switch (this.solicitud.codDestino) {
                default:
                this.commonData.gridTitle = 'Archivo flujo de caja';
                this.commonData.textButton = 'Nueva Versión'
                break;
              case DestinoCredito.SOSTENIMIENTO:
                this.commonData.gridTitle = 'Archivo Hoja de Trabajo';
                this.commonData.textButton = 'Adjuntar Archivo'
                break;
            }

            this.store.dispatch(FlujoCajaGUFActions.setTablaGuf({ items: flujocaja.guf }));

            this.esfaSvc.setData(flujocaja.esfaTree, flujocaja);
            let esfa = this.esfaSvc.calcularDatosEsfa();
            this.store.dispatch(FlujoCajaESFAActions.setTablaEsfa({ items: esfa }));

            this.eraSvc.setData(flujocaja.eraTree, flujocaja);

            let era = this.eraSvc.calcularDatosEra();
            this.store.dispatch(FlujoCajaERAActions.setTablaEra({ items: era }));

            this.tablaSvc.setData(parametrosFC, flujocaja.fcDetalleTree, this.solicitud, flujocaja, this.modo);
            let tablafc = this.tablaSvc.calcularTablaFC();
            this.store.dispatch(FlujoCajaDetalleActions.setTablaFCDetalle({ items: tablafc }));

            this.store.dispatch(FlujoCajaPDRActions.setPDR({ items: flujocaja.planDR }));
            this.store.dispatch(FlujoCajaOCActions.setOC({ items: flujocaja.otrosCargos }));

            this.store.dispatch(FlujoCajaHPActions.setHP({ items: flujocaja.flujoCajaHP }));

            this.rseSvc.setData(flujocaja.rse, flujocaja, tablafc, esfa, this.solicitud);
            let rse = this.rseSvc.calcularRSE();
            this.store.dispatch(FlujoCajaRSEActions.setRSE({ rse }));

            this.loadingService.loading(false);
          } catch (error) {
            this.messageSvc.add({
              severity: 'error',
              summary: 'Advertencia',
              detail: error,
              life: 3000
            });
            this.loadingService.loading(false);
          }

        },
        error: (error) => {
          this.messageSvc.add({
            severity: 'error',
            summary: 'Advertencia',
            detail: error,
            life: 3000
          });
          this.loadingService.loading(false);
        }
      })

    } else {
    }

  }

  /*cargarDatosParametros() {
    this.dataSvc.obtenerParametrosVersionActiva().subscribe(response => {
      this.store.dispatch(FlujoCajaParametrosActions.setParametrosDPD({ items: response['parametrosDPD'] }));
      this.store.dispatch(FlujoCajaParametrosActions.setParametrosDPI({ items: response['parametrosDPI'] }));
      this.store.dispatch(FlujoCajaParametrosActions.setParametrosAlerta({ items: response['parametrosAlerta'] }));
    });
  }*/


  cargarDatosHP(ubigeo: string) {
    this.hpSvc.obtenerHojaProductoByUbigeo(ubigeo).subscribe({
      next: (response: HojaProducto[]) => {
        if (response) {
          this.tablaSvc.setDataHP(response);
          this.store.dispatch(HojaProductoActions.setHojaProducto({ items: response }))
        }
      }
    })
  }

  Cerrar(): void {
    this.router.navigate(['/flujo-caja/revisar']);
  }

  openModal() {
    const dialogRef = this.dialog.open(ModalObservarComponent, {
      width: '580px',
      data: { comment: '' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.comment = result;
        this.Update();
      }
    });
  }

  Update() {
    if (this.comment !== null) {
      const idFc = this.idFlujoCaja;
      const _comment = this.comment;
      this.actualizarSolicitud(idFc, _comment);
      this.errorMessage = null;
    } else {
      this.errorMessage = 'Es necesario ingresar el detalle de la observación.';
    }
  }
  actualizarSolicitud(idFc: number, _comment: string) {
    if (idFc > 0 && _comment !== undefined) {
      const datosActualizar: ActualizarRevisarFC = {
        idf: idFc,
        comment: _comment,
      };

      this.revisarfcsrv.observarCreditoFC(datosActualizar).subscribe(
        (response) => {
          this.router.navigate(['/flujo-caja/revisar', { isSuccess: "1" }]);
        },
        (error) => {
          Swal.fire({
            text: error.error.errors.error[0],
            icon: 'warning',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            timer: 8000
          });
          // this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se registrar la observación.' });
        }
      );
    }
  }
}
