import { Component, AfterViewInit, OnInit, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { CommonData, DestinoCredito, FlujoCaja, FlujoCajaDPD, FlujoCajaDPI, FlujoCajaHP, FlujoCajaOC, FlujoCajaPDR, Rse } from 'src/app/models/flujocaja.interface';
import * as FlujoCajaActions from '../../redux/actions/flujo-caja/flujo.caja.actions';
import * as FlujoCajaGUFActions from '../../redux/actions/flujo-caja/guf.actions';
import * as FlujoCajaESFAActions from '../../redux/actions/flujo-caja/esfa.actions';
import * as FlujoCajaERAActions from '../../redux/actions/flujo-caja/era.actions';
import * as FlujoCajaDetalleActions from '../../redux/actions/flujo-caja/fcdetalle.actions';
import * as FlujoCajaOCActions from '../../redux/actions/flujo-caja/oc.actions';
import * as FlujoCajaHPActions from '../../redux/actions/flujo-caja/hp.actions';
import * as FlujoCajaRatiosActions from '../../redux/actions/flujo-caja/ratios.actions';
import * as ComentariosActions from '../../redux/actions/flujo-caja/comentarios.actions';
import * as SensibilizacionesActions from '../../redux/actions/flujo-caja/sensibilizaciones.actions';
import * as HojaProductoActions from '../../redux/actions/hoja-producto/hoja.producto.actions';
import * as FlujoCajaPDRActions from 'src/app/redux/actions/flujo-caja/pdr.actions';
import * as FlujoCajaParametrosActions from 'src/app/redux/actions/flujo-caja/parametros.actions';
import * as FlujoCajaDedudaDPIActions from 'src/app/redux/actions/flujo-caja/deuda.dpi.actions';
import * as FlujoCajaDedudaDPDActions from 'src/app/redux/actions/flujo-caja/deuda.dpd.actions';
import * as FlujoCajaRSEActions from '../../redux/actions/flujo-caja/rse.actions';
import * as SharedActions from '../../redux/actions/shared/shared.actions';
import { FlujoCajaService } from 'src/app/services/flujo-caja.service';
import { DataService } from 'src/app/services/data.service';
import { HojaProductoService } from 'src/app/services/hoja-producto.service';
import { HojaProducto } from 'src/app/models/hojaProducto.interface';
import { FlujoCajaMasterRequestDto } from 'src/app/models/FlujoCajaMasterRequest.interface';
import { Comentarios, Shared } from 'src/app/models/shared.interface';
import { selectShared } from 'src/app/redux/selectors/shared/shared.selectors';
import { MessageService, TreeNode } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { EstadoFC, ModoFC } from 'src/app/models/estado.enum';
import { SolicitudService } from 'src/app/services/solicitud.service';
import { Solicitud } from 'src/app/models/solicitud.interface';
import { SharedERAService } from 'src/app/services/shared/shared.era.service';
import { SharedESFAService } from 'src/app/services/shared/shared.esfa.service';
import { SharedESFAService as SharedGUFervice } from 'src/app/services/shared/shared.guf.service';
import { SharedFCDetalleService } from 'src/app/services/shared/shared.fcdetalle.service';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { selectTablaGUF } from 'src/app/redux/selectors/flujo-caja/guf.selectors';
import { selectTablaESFA } from 'src/app/redux/selectors/flujo-caja/esfa.selectors';
import { selectComentariosFC } from 'src/app/redux/selectors/flujo-caja/comentarios.selectors';
import Swal from 'sweetalert2';
import { selectFCData } from 'src/app/redux/selectors/flujo-caja/flujo.caja.selectors';
import { LoadingService } from 'src/app/services/comun/loading.service';
import { SharedRSEService } from 'src/app/services/shared/shared.rse.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { selectRatios } from 'src/app/redux/selectors/flujo-caja/ratios.selectors';
import { DatosFC } from 'src/app/models/dataseguridad.interface';
import { SecurityService } from 'src/app/services/security.service';
import { ParametroVersion } from 'src/app/models/parametroVersion.interface';
import { ParametroVersionFC } from 'src/app/models/parametroVersionFC.interface';
import { FlujoCajaItemConstants } from 'src/app/shared/common/flujoCajaItemConstants';
import { ESFAConstants } from 'src/app/shared/common/esfa.constants';
import { ERAConstants } from 'src/app/shared/common/era.constants';
import { RatiosConstants } from 'src/app/shared/common/ratios.constants';

export interface FlujoCajaResponse {
  solicitud: Solicitud,
  flujoCaja: FlujoCaja
}

@Component({
  selector: 'app-flujo-caja',
  templateUrl: './flujo-caja.component.html',
  styleUrls: ['./flujo-caja.component.css'],
  providers: [MessageService]
})
export class FlujoCajaComponent implements OnInit, AfterViewInit {

  destinoCredito = DestinoCredito;
  FlujoCajaView: boolean = false;
  ConsultarFCView: boolean = false;
  commonData: CommonData = {
    codDestino: '',
    gridTitle: '',
    textButton: ''
  }
  btnExportar: boolean = false;
  fc: FlujoCaja;
  loading: boolean = false;
  tab: number;

  pdr: FlujoCajaPDR[];
  flujoCajaHP: FlujoCajaHP[];
  oc: FlujoCajaOC[];
  deudaDPD: FlujoCajaDPD[];
  deudaDPI: FlujoCajaDPI[];
  shared: Shared;

  EstadoFC = EstadoFC;
  ModoFC = ModoFC;
  rse: Rse;

  guf: any[] = [];
  esfa: any[] = [];
  ratios: any[] = [];

  porcentajeProgreso: number = 0;

  idFlujoCaja: number;
  modo: string;
  nroDocumento: string;
  nroSolicitud: number;
  solicitud: Solicitud;
  vista: string;
  comentarios: Comentarios;

  hash = new Map<string, string>();
  hashInvertido = new Map<string, string>();


  readonly MODO_DETALLE = "DETALLE";
  readonly MODO_EDITAR = "EDITAR";
  readonly MODO_NUEVO = "NUEVO";

  constructor(private store: Store<AppState>
    , private flujoCajaSvc: FlujoCajaService
    , private dataSvc: DataService
    , private hpSvc: HojaProductoService
    , private route: ActivatedRoute
    , private solicitudSvc: SolicitudService
    , private router: Router
    , private sharedSvc: SharedService
    , private gufSvc: SharedGUFervice
    , private eraSvc: SharedERAService
    , private esfaSvc: SharedESFAService
    , private tablaSvc: SharedFCDetalleService
    , private rseSvc: SharedRSEService
    , private messageSvc: MessageService
    , private loadingService: LoadingService
    , private cd: ChangeDetectorRef
    , private securityService: SecurityService
  ) { }

  ngOnInit(): void {
    let datos: DatosFC = this.securityService.leerDatosFC();
    this.loadingService.loading(true);
    if (this.router.url === '/consultaflujocaja') {
      this.btnExportar = true;
      this.ConsultarFCView = true;
      if (datos == undefined) {
        this.router.navigate(['/flujo-caja/consulta'])
      }
    } else {
      this.btnExportar = false;
      this.FlujoCajaView = true;

      if (datos == undefined) {
        this.router.navigate(['/solicitud-credito/consulta'])
      }
    }
    this.idFlujoCaja = datos.idFlujoCaja;
    this.modo = datos.modo;
    this.nroDocumento = datos.numeroDocumento.trim();
    this.nroSolicitud = datos.numeroSolicitud;
    this.vista = datos.vista;
    this.isEditableFC(this.modo);
    let solicitudCredito: Solicitud = {
      numeroSolicitud: this.nroSolicitud,
      numeroDocumento: this.nroDocumento
    };

    this.hash.set('Normal', '1')
    this.hash.set('CPP', '2')
    this.hash.set('Deficiente', '3')
    this.hash.set('Dudoso', '4')
    this.hash.set('Perdida', '5')

    this.hashInvertido.set('1','Normal')
    this.hashInvertido.set('2','CPP')
    this.hashInvertido.set('3','Deficiente')
    this.hashInvertido.set('4','Dudoso')
    this.hashInvertido.set('5','Perdida')

    forkJoin([
      this.solicitudSvc.getSolicitudCredito(solicitudCredito, this.vista),
      this.flujoCajaSvc.obtenerFlujoCajaById(this.idFlujoCaja, this.nroDocumento, this.nroSolicitud, this.vista),
      this.dataSvc.obtenerParametrosVersionActiva(this.idFlujoCaja)
    ]).subscribe({
      next: response => {

        try {
          this.solicitud = response[0];
          this.commonData.codDestino = this.solicitud.codDestino;

          // this.porcentajeProgreso
          //this.cargarDatosParametros();

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

          let parametrosFC: ParametroVersionFC = response[2];
          
        
          this.store.dispatch(FlujoCajaParametrosActions.setParametrosDPD({ items: parametrosFC.parametrosDPD }));
          this.store.dispatch(FlujoCajaParametrosActions.setParametrosDPI({ items: parametrosFC.parametrosDPI }));
          this.store.dispatch(FlujoCajaParametrosActions.setParametrosAlerta({ items: parametrosFC.parametrosAlerta }));
          this.store.dispatch(FlujoCajaParametrosActions.setParametrosComportamiento({ items: parametrosFC.parametrosComportamiento }));
          this.store.dispatch(FlujoCajaParametrosActions.setParametrosTipoCliente({ items: parametrosFC.parametrosTipoCliente }));
          this.store.dispatch(FlujoCajaParametrosActions.setParametrosRSECondiciones({ items: parametrosFC.parametrosRSECondicion }))
          this.store.dispatch(FlujoCajaParametrosActions.setParametrosESFA({ items: parametrosFC.parametrosESFA }));


          this.store.dispatch(FlujoCajaActions.setSolicitud({ solicitud: this.solicitud }));

          this.cargarDatosHP(this.solicitud.ubigeoDep);

          this.store.dispatch(FlujoCajaActions.setFlujoCaja({ flujocaja }));
          this.store.dispatch(FlujoCajaRatiosActions.setRatios({ items: flujocaja.ratios }));


          if(this.modo != this.ModoFC.NUEVO){

            flujocaja.deudaPD.forEach(e =>{
              e.montoDeuda = e.montoDeuda ? e.montoDeuda : 0;
              let deuda: FlujoCajaDPD = { idParametroDpd: e.idParametroDpd, montoDeuda: e.montoDeuda }
              this.store.dispatch(FlujoCajaDedudaDPDActions.addDeudaDirecta({ deudadirecta: deuda }));
            });

            flujocaja.deudaPI.forEach(e => {
              let deuda: FlujoCajaDPI = { idParametroDpi: e.idParametroDpi, montoDeuda: e.montoDeuda, calificacion: this.hashInvertido.get(e.calificacion) }
              this.store.dispatch(FlujoCajaDedudaDPIActions.addDeudaIndirecta({ deudaindirecta: deuda}));
            });
          }


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
            case DestinoCredito.SOSTENIMIENTO:
              this.commonData.gridTitle = 'Archivo Hoja de Trabajo';
              this.commonData.textButton = 'Adjuntar Archivo'
              break;
            default:
              this.commonData.gridTitle = 'Archivo flujo de caja';
              this.commonData.textButton = 'Nueva Versión'
              break;
          }

          this.gufSvc.setData(flujocaja.guf, flujocaja);
          // let guf = this.gufSvc.calcularDatosEsfa();
          // this.store.dispatch(FlujoCajaGUFActions.setTablaGuf({ items: guf }));

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

          console.log(flujocaja.rse)
          this.rseSvc.setData(flujocaja.rse, flujocaja, tablafc, esfa, this.solicitud);
          let rse = this.rseSvc.calcularRSE();

          this.store.dispatch(FlujoCajaRSEActions.setRSE({ rse: rse }));



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

    this.store.select(selectFCData).subscribe({
      next: data => {
        this.fc = data.flujoCaja;
        this.pdr = data.pdr.map(p => ({ ...p }));
        this.oc = data.oc.map(o => ({ ...o }));
        this.flujoCajaHP = data.flujoCajaHP.map(hp => ({ ...hp }));
        this.deudaDPD = data.deudaDPD.map(dpd => ({ ...dpd }));
        this.deudaDPI = data.deudaDPI.map(dpi => ({ ...dpi }));
        this.rse = data.rse;
        this.solicitud = data.solicitud;
      }
    });



    this.store.select(selectTablaGUF).subscribe({
      next: data => this.guf = data
    });
    // this.store.select(selectTablaESFA).subscribe({
    //   next: data => this.esfa = data
    // });
    this.store.select(selectComentariosFC).subscribe({
      next: data => this.comentarios = data
    });
    this.store.select(selectRatios).subscribe({
      next: data => this.ratios = data
    })



  }

  ngAfterViewInit() {

    this.store.select(selectShared).subscribe({
      next: (data: Shared) => {
        if (data) {
          this.porcentajeProgreso = 0;
          if (data.isCompletedGUF) {
            this.porcentajeProgreso += 20;
            this.cd.detectChanges();
          }
          if (data.isCompletedESFA) {
            this.porcentajeProgreso += 20;
            this.cd.detectChanges();
          }
          if (data.isCompletedERA) {
            this.porcentajeProgreso += 20;
            this.cd.detectChanges();
          }
          if (data.isCompletedFC) {
            this.porcentajeProgreso += 20;
            this.cd.detectChanges();
          }
          if (data.isCompletedRSE) {
            this.porcentajeProgreso += 20;
            this.cd.detectChanges();
          }
        }
        else {
          this.porcentajeProgreso = 0;
          this.cd.detectChanges();
        }
      }
    });
  }

  isEditableFC(modo: string) {
    let bool: boolean;
    switch (modo) {
      case this.MODO_DETALLE:
        bool = false;
        break;
      case this.MODO_EDITAR:
        bool = true;
        break;
      case this.MODO_NUEVO:
        bool = true;
        break;
      default:
        bool = false;
        break;
    }
    this.store.dispatch(SharedActions.setModoFC({ isEditableFC: bool }));
  }

  /*cargarDatosParametros() {
    this.dataSvc.obtenerParametrosVersionActiva().subscribe(response => {
      this.store.dispatch(FlujoCajaParametrosActions.setParametrosDPD({ items: response['parametrosDPD'] }));
      this.store.dispatch(FlujoCajaParametrosActions.setParametrosDPI({ items: response['parametrosDPI'] }));
      this.store.dispatch(FlujoCajaParametrosActions.setParametrosAlerta({ items: response['parametrosAlerta'] }));
      this.store.dispatch(FlujoCajaParametrosActions.setParametrosComportamiento({ items: response['parametrosComportamiento'] }));
      this.store.dispatch(FlujoCajaParametrosActions.setParametrosTipoCliente({ items: response['parametrosTipoCliente'] }));
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

  getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  };

  trimAll(obj) {
    for (let prop in obj) {
      if (typeof obj[prop] === "string") {
        obj[prop] = obj[prop].trim();
      } else {
        this.trimAll(obj[prop]);
      }
    }
  }

  obtenerDatosNodo(data: any[], codItem: string) {
    return data.find(nodo => nodo.codItem === codItem);
  }
  guardarAvanceHojaTrabajo() {
    this.loadingService.loading(true);

    let form: FlujoCajaMasterRequestDto = this.mapearFlujoCaja(EstadoFC.PENDIENTE);
    try {
      if (this.modo == ModoFC.EDITAR && this.fc.codEstado == EstadoFC.OBSERVADO) {

        this.flujoCajaSvc.editarFlujoCaja(form).subscribe({
          next: (response: any) => {
            this.loadingService.loading(false);
            this.messageSvc.clear();
            this.messageSvc.add({
              severity: 'success',
              summary: 'Alerta',
              detail: (this.modo == ModoFC.EDITAR) && (this.fc?.codEstado == EstadoFC.OBSERVADO) ? 'Finalizado exitosamente.' : 'Avance guardado exitosamente.',
              life: 3000
            });
            if ((this.modo == ModoFC.EDITAR) && (this.fc?.codEstado == EstadoFC.OBSERVADO)) {
              setTimeout(() => {
                this.router.navigate(['/solicitud-credito/consulta']);
              }, 3000);
            }
          },
          error: error => {
            this.loadingService.loading(false);
            let valueError: string = '';
            for (const [key, value] of Object.entries(error.error.errors)) {
              valueError = value[0];
            }
            this.messageSvc.clear();
            this.messageSvc.add({
              severity: 'error',
              summary: 'Advertencia',
              detail: valueError,
              life: 3000
            });
          }
        });


      } else if (this.modo == ModoFC.EDITAR) {
        this.flujoCajaSvc.editarFlujoCaja(form).subscribe({
          next: (response: any) => {
            this.loadingService.loading(false);
            this.messageSvc.clear();
            this.messageSvc.add({
              severity: 'success',
              summary: 'Alerta',
              detail: 'Avance guardado exitosamente.',
              life: 3000
            });
          },
          error: error => {
            this.loadingService.loading(false);
            let valueError: string = '';
            for (const [key, value] of Object.entries(error.error.errors)) {
              valueError = value[0];
            }
            this.messageSvc.clear();
            this.messageSvc.add({
              severity: 'error',
              summary: 'Advertencia',
              detail: valueError,
              life: 3000
            });
          }
        });
      } else if (this.modo == ModoFC.NUEVO) {
        this.flujoCajaSvc.guardarFlujoCaja(form).subscribe({
          next: (response: any) => {
            form.idFC = response.idFC;
            this.modo = ModoFC.EDITAR;
            this.fc.codEstado = EstadoFC.PENDIENTE;
            this.loadingService.loading(false);
            this.messageSvc.clear();
            this.messageSvc.add({
              severity: 'success',
              summary: 'Alerta',
              detail: 'Avance guardado exitosamente.',
              life: 3000
            });
            // const id = response.flujoCajaId;
            // if(id > 0)
            // {
            //   const datos = { idFlujoCaja: id, 
            //     nroDocumento: response.nroDocumento,
            //     nroSolicitud : response.nroSolicitud, 
            //     modo: ModoFC.EDITAR };
            //   this.router.navigate(['/flujocaja', datos ] );
            // }
          },
          error: error => {
            this.loadingService.loading(false);
            let valueError: string = '';
            // for (const [key, value] of Object.entries(error.error.errors)) {
            //   valueError = value[0];
            // }
            this.messageSvc.clear();
            this.messageSvc.add({
              severity: 'error',
              summary: 'Advertencia',
              detail: valueError,
              life: 3000
            });
          }
        });
      }
    }
    catch (error) {
      this.loadingService.loading(false);
      this.messageSvc.add({
        severity: 'error',
        summary: 'Advertencia',
        detail: error,
        life: 3000
      });
    }
  }
  guardarAvance() {

    this.loadingService.loading(true);

    let form: FlujoCajaMasterRequestDto = this.mapearFlujoCaja(EstadoFC.PENDIENTE);

    try {
      let saveFC: Boolean = true;
      if (this.modo == ModoFC.EDITAR && this.fc.codEstado == EstadoFC.OBSERVADO) {
        let suma = 0;
        const MAXIMO_PORCENTAJE = 100;
        let esValido = true;
        let valorAnterior = null;
        console.log(form.planDR)
        if(form.planDR.length > 0){
          form.planDR.forEach((item,i) => {
            suma += item.porcentaje;
            if(i > 0){
              if(item.mes <= valorAnterior){
                esValido = false;
              }
            }
            valorAnterior = item.mes
          });
        }
        let ESF001 = form.esfa.find(item => item.codItem === ESFAConstants.TotalActivo);
        let FCD014 = form.fCDetalle.find(item => item.codItem === FlujoCajaItemConstants.FlujoFinanciero_MontoCredito);
        let ERA015 = form.era.find(item => item.codItem === ERAConstants.ExcedenteNetoEjercicio);
        let ratioLiquidez = this.ratios.find(item => item.idParametroRatio === RatiosConstants.Liquidez);
        let RSEComportamiento = form.rse.comportamiento;

        if ((ESF001.porcentajeAH * 100 < -30) && (form.comentarioEsfa == null || form.comentarioEsfa.length < 2)) {
          this.loadingService.loading(false);
          this.messageSvc.clear();
          this.messageSvc.add({
            severity: 'error',
            summary: 'Advertencia',
            detail: "Si el Total Activo de la 5ta. Columna es menor a -30% debe exigir comentario",
            life: 3000
          });
        } else if (RSEComportamiento == '') {
          this.loadingService.loading(false);
          this.messageSvc.clear();
          this.messageSvc.add({
            severity: 'error',
            summary: 'Advertencia',
            detail: "Completar el criterio 3.",
            life: 3000
          });
        }
        else if (FCD014.total > form.montoTotalFinanciar) {
          this.loadingService.loading(false);
          this.messageSvc.clear();
          this.messageSvc.add({
            severity: 'warn',
            summary: 'Advertencia',
            detail: "La suma de las columnas del plazo del crédito del ítem 'Monto del Crédito' no deben superar al monto solicitado",
            life: 3000
          });
        }
        else if (form.precioPromedio == 0 || form.rendimientoPromedio == 0) {
          this.loadingService.loading(false);
          this.messageSvc.clear();
          this.messageSvc.add({
            severity: 'warn',
            summary: 'Advertencia',
            detail: "Es obligatorio Registrar Rendimiento y Precio Promedio.",
            life: 3000
          });
        } else if (((ERA015 && ERA015.montoActual == 0) || (ratioLiquidez && ratioLiquidez.resultado < 1)) && (form.comentarioEra == null || form.comentarioEra.length < 2 )) {
          this.loadingService.loading(false);
          this.messageSvc.clear();
          this.messageSvc.add({
            severity: 'error',
            summary: 'Advertencia',
            detail: "Si el valor “Excedente neto del Ejercicio” es cero o el valor del ratio Liquidez es menor que 1, exigir registro de comentario para el Estado de Resultados Agropecuario",
            life: 3000
          });
        } else if ((form.rse.condicion.toLowerCase() === "expuesto" || form.rse.condicion.toLowerCase() === "potencialmente expuesto") && (form.comentarioRse == null || form.comentarioRse.length < 2)) {
          this.loadingService.loading(false);
          this.messageSvc.clear();
          this.messageSvc.add({
            severity: 'error',
            summary: 'Advertencia',
            detail: "Según la caja de texto Condición es obligatorio registrar comentario",
            life: 3000
          });
        }
        else if(form.planDR.length == 0){
          this.loadingService.loading(false);
          this.messageSvc.clear();
          this.messageSvc.add({
            severity: 'warn',
            summary: 'Advertencia',
            detail: "Debe completar el Plan Desembolso",
            life: 3000
          });
        }
        else if(form.planDR[0].mes != 0){
          this.loadingService.loading(false);
          this.messageSvc.clear();
          this.messageSvc.add({
            severity: 'warn',
            summary: 'Advertencia',
            detail: "Para el primer mes la columna Mes Desembolso debe ser 0",
            life: 3000
          });
        }
        else if(suma != MAXIMO_PORCENTAJE){
          this.loadingService.loading(false);
          this.messageSvc.clear();
          this.messageSvc.add({
            severity: 'warn',
            summary: 'Advertencia',
            detail: "La sumatoria de la columna % desembolso debe ser 100%",
            life: 3000
          });
        }
        else if(!esValido){
          this.loadingService.loading(false);
          this.messageSvc.clear();
          this.messageSvc.add({
            severity: 'warn',
            summary: 'Advertencia',
            detail: "El Mes Desembolso debe ser mayor a la anterior.",
            life: 3000
          });
        }
        else {
          this.flujoCajaSvc.editarFlujoCaja(form).subscribe({
            next: (response: any) => {
              this.loadingService.loading(false);
              this.messageSvc.clear();
              this.messageSvc.add({
                severity: 'success',
                summary: 'Alerta',
                detail: (this.modo == ModoFC.EDITAR) && (this.fc?.codEstado == EstadoFC.OBSERVADO) ? 'Finalizado exitosamente.' : 'Avance guardado exitosamente.',
                life: 3000
              });
              if ((this.modo == ModoFC.EDITAR) && (this.fc?.codEstado == EstadoFC.OBSERVADO)) {
                setTimeout(() => {
                  this.router.navigate(['/solicitud-credito/consulta']);
                }, 3000);
              }
            },
            error: error => {
              this.loadingService.loading(false);
              let valueError: string = '';
              for (const [key, value] of Object.entries(error.error.errors)) {
                valueError = value[0];
              }
              this.messageSvc.clear();
              this.messageSvc.add({
                severity: 'error',
                summary: 'Advertencia',
                detail: valueError,
                life: 3000
              });
            }
          });
        }


      } else if (this.modo == ModoFC.EDITAR) {
        console.log(form.planDR)
        this.flujoCajaSvc.editarFlujoCaja(form).subscribe({
          next: (response: any) => {
            this.loadingService.loading(false);
            this.messageSvc.clear();
            this.messageSvc.add({
              severity: 'success',
              summary: 'Alerta',
              detail: 'Avance guardado exitosamente.',
              life: 3000
            });
          },
          error: error => {
            this.loadingService.loading(false);
            let valueError: string = '';
            for (const [key, value] of Object.entries(error.error.errors)) {
              valueError = value[0];
            }
            this.messageSvc.clear();
            this.messageSvc.add({
              severity: 'error',
              summary: 'Advertencia',
              detail: valueError,
              life: 3000
            });
          }
        });
      } else if (this.modo == ModoFC.NUEVO) {
        console.log(form.planDR)
        this.flujoCajaSvc.guardarFlujoCaja(form).subscribe({
          next: (response: any) => {
            form.idFC = response.idFC;
            this.fc.codDestino = response.codDestino;
            this.modo = ModoFC.EDITAR;
            this.fc.codEstado = EstadoFC.PENDIENTE;
            this.loadingService.loading(false);
            this.messageSvc.clear();
            this.messageSvc.add({
              severity: 'success',
              summary: 'Alerta',
              detail: 'Avance guardado exitosamente.',
              life: 3000
            });
            // const id = response.flujoCajaId;
            // if(id > 0)
            // {
            //   const datos = { idFlujoCaja: id, 
            //     nroDocumento: response.nroDocumento,
            //     nroSolicitud : response.nroSolicitud, 
            //     modo: ModoFC.EDITAR };
            //   this.router.navigate(['/flujocaja', datos ] );
            // }
          },
          error: error => {
            this.loadingService.loading(false);
            let valueError: string = '';
            for (const [key, value] of Object.entries(error.error.errors)) {
              valueError = value[0];
            }
            this.messageSvc.clear();
            this.messageSvc.add({
              severity: 'error',
              summary: 'Advertencia',
              detail: valueError,
              life: 3000
            });
          }
        });
      }
    }
    catch (error) {
      this.loadingService.loading(false);
      this.messageSvc.add({
        severity: 'error',
        summary: 'Advertencia',
        detail: error,
        life: 3000
      });
    }

    // this.flujoCajaSvc.guardarFlujoCaja(this.fc);
  }

  continuarMasTarde() {
    this.loadingService.loading(true);
    let form: FlujoCajaMasterRequestDto = this.mapearFlujoCaja(EstadoFC.PENDIENTE);
    try {
      this.flujoCajaSvc.editarFlujoCaja(form).subscribe({
        next: response => {
          this.loadingService.loading(false);
          this.messageSvc.clear();
          this.messageSvc.add({
            severity: 'success',
            summary: 'Alerta',
            detail: 'Se guardó el avance exitosamente.',
            life: 3000
          });
          setTimeout(() => {
            this.router.navigate(['/solicitud-credito/consulta']);
          }, 1000);
        },
        error: error => {
          let valueError: string = '';
          for (const [key, value] of Object.entries(error.error.errors)) {
            valueError = value[0];
          }
          this.loadingService.loading(false);
          this.messageSvc.clear();
          this.messageSvc.add({
            severity: 'error',
            summary: 'Advertencia',
            detail: valueError,
            life: 3000
          });
        }
      });
    }
    catch (error) {
      this.messageSvc.add({
        severity: 'error',
        summary: 'Advertencia',
        detail: error,
        life: 3000
      });
      this.loadingService.loading(false);

    }
  }

  cerrar(){

    this.router.navigate(['/solicitud-credito/consulta']);
  }


  cerrarSinGuardar() {
    if(this.router.url == '/consultaflujocaja'){
      this.router.navigate(['/flujo-caja/consulta']);
    }else{
      Swal.fire({
        text: "Los cambios no serán guardados.",
        icon: 'warning',
        showCancelButton: false,
        showConfirmButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'No',
        timer: 0
      }).then((result) => {
        if (result.isConfirmed) {
            this.router.navigate(['/solicitud-credito/consulta']);
        }
      });
    }
  }



  finalizarHojaTrabajo() {
    let form: FlujoCajaMasterRequestDto = this.mapearFlujoCaja(EstadoFC.FINALIZADO);
    try {
      Swal.fire({
        text: "Ya no podrá editar ninguno de los formularios de FC, ¿Está seguro?",
        icon: 'warning',
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, continuar',
        cancelButtonText: 'No',
        timer: 0
      }).then((result) => {
        if (result.isConfirmed) {
          this.loadingService.loading(true);

          this.flujoCajaSvc.finalizarFlujoCaja(form, form.idFC).subscribe({
            next: response => {
              this.loadingService.loading(false);
              this.messageSvc.clear();
              this.messageSvc.add({
                severity: 'success',
                summary: 'Alerta',
                detail: 'Finalizado exitosamente.',
                life: 3000
              });
              setTimeout(() => {
                this.router.navigate(['/solicitud-credito/consulta']);
              }, 3000);
            },
            error: error => {
              this.loadingService.loading(false);
              this.messageSvc.clear();
              this.messageSvc.add({
                severity: 'error FINALIZAR',
                summary: 'Advertencia',
                detail: 'Ha ocurrido un error, intentelo mas tarde',
                life: 3000
              });
            }
          });
        }
      });
    }
    catch (error) {
      this.messageSvc.add({
        severity: 'error',
        summary: 'Advertencia',
        detail: error,
        life: 3000
      });
      this.loadingService.loading(false);
    }
  }
  finalizar() {
    //this.loading = true;
    let form: FlujoCajaMasterRequestDto = this.mapearFlujoCaja(EstadoFC.FINALIZADO);
    let suma = 0;
    const MAXIMO_PORCENTAJE = 100;
    let esValido = true;
    let valorAnterior = null;
    if(form.planDR.length > 0){
      form.planDR.forEach((item,i) => {
        suma += item.porcentaje;
        if(i > 0){
          if(item.mes <= valorAnterior){
            esValido = false;
          }
        }
        valorAnterior = item.mes
      });
    }
    try {
      Swal.fire({
        text: "Ya no podrá editar ninguno de los formularios de FC, ¿Está seguro?",
        icon: 'warning',
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, continuar',
        cancelButtonText: 'No',
        timer: 0
      }).then((result) => {
        if (result.isConfirmed) {
          this.loadingService.loading(true);
          let ESF001 = form.esfa.find(item => item.codItem === ESFAConstants.TotalActivo);
          let FCD014 = form.fCDetalle.find(item => item.codItem === FlujoCajaItemConstants.FlujoFinanciero_MontoCredito);
          let ERA015 = form.era.find(item => item.codItem === ERAConstants.ExcedenteNetoEjercicio);
          let ratioLiquidez = this.ratios.find(item => item.idParametroRatio === RatiosConstants.Liquidez);
          let RSEComportamiento = form.rse.comportamiento

          if (ESF001.porcentajeAH * 100 < -30 && (form.comentarioEsfa == null || form.comentarioEsfa.length < 2)) {
            this.loadingService.loading(false);
            this.messageSvc.clear();
            this.messageSvc.add({
              severity: 'warn',
              summary: 'Advertencia',
              detail: "Si el Total Activo de la 5ta. Columna es menor a -30% debe exigir comentario.",
              life: 3000
            });
          } else if (RSEComportamiento == '') {
            this.loadingService.loading(false);
            this.messageSvc.clear();
            this.messageSvc.add({
              severity: 'warn',
              summary: 'Advertencia',
              detail: "Completar el criterio 3.",
              life: 3000
            });
          }
          else if (FCD014.total > form.montoTotalFinanciar) {
            this.loadingService.loading(false);
            this.messageSvc.clear();
            this.messageSvc.add({
              severity: 'warn',
              summary: 'Advertencia',
              detail: "La suma de las columnas del plazo del crédito del ítem 'Monto del Crédito' no deben superar al monto solicitado",
              life: 3000
            });
          }
          else if (form.precioPromedio == 0 || form.rendimientoPromedio == 0) {
            this.loadingService.loading(false);
            this.messageSvc.clear();
            this.messageSvc.add({
              severity: 'warn',
              summary: 'Advertencia',
              detail: "Es obligatorio Registrar Rendimiento y Precio Promedio.",
              life: 3000
            });
          }
          else if (((ERA015 && ERA015.montoActual == 0) || (ratioLiquidez && ratioLiquidez.resultado < 1)) && (form.comentarioEra == null || form.comentarioEra.length < 2)) { //TODO
            this.loadingService.loading(false);
            this.messageSvc.clear();
            this.messageSvc.add({
              severity: 'warn',
              summary: 'Advertencia',
              detail: "Si el valor “Excedente neto del Ejercicio” es cero o el valor del ratio Liquidez es menor que 1, exigir registro de comentario para el “Estado de Resultados Agropecuario",
              life: 3000
            });
          } else if ((form.rse.condicion.toLowerCase() === "expuesto" || form.rse.condicion.toLowerCase() === "potencialmente expuesto") && (form.comentarioRse == null || form.comentarioRse.length < 2)) {
            this.loadingService.loading(false);
            this.messageSvc.clear();
            this.messageSvc.add({
              severity: 'warn',
              summary: 'Advertencia',
              detail: "Según la caja de texto Condición es obligatorio registrar comentario",
              life: 3000
            });
          }
          else if(form.planDR.length == 0){
            this.loadingService.loading(false);
            this.messageSvc.clear();
            this.messageSvc.add({
              severity: 'warn',
              summary: 'Advertencia',
              detail: "Debe completar el Plan Desembolso",
              life: 3000
            });
          }
          else if(form.planDR[0].mes != 0){
            this.loadingService.loading(false);
            this.messageSvc.clear();
            this.messageSvc.add({
              severity: 'warn',
              summary: 'Advertencia',
              detail: "Para el primer mes la columna Mes Desembolso debe ser 0",
              life: 3000
            });
          }
          else if(suma != MAXIMO_PORCENTAJE){
            this.loadingService.loading(false);
            this.messageSvc.clear();
            this.messageSvc.add({
              severity: 'warn',
              summary: 'Advertencia',
              detail: "La sumatoria de la columna % desembolso debe ser 100%",
              life: 3000
            });
          }
          else if(!esValido){
            this.loadingService.loading(false);
            this.messageSvc.clear();
            this.messageSvc.add({
              severity: 'warn',
              summary: 'Advertencia',
              detail: "El Mes Desembolso debe ser mayor a la anterior.",
              life: 3000
            });
          }
          else {
            this.flujoCajaSvc.finalizarFlujoCaja(form, form.idFC).subscribe({
              next: response => {
                this.loadingService.loading(false);
                this.messageSvc.clear();
                this.messageSvc.add({
                  severity: 'success',
                  summary: 'Alerta',
                  detail: 'Finalizado exitosamente.',
                  life: 3000
                });
                setTimeout(() => {
                  this.router.navigate(['/solicitud-credito/consulta']);
                }, 3000);
              },
              error: error => {
                this.loadingService.loading(false);
                this.messageSvc.clear();
                this.messageSvc.add({
                  severity: 'error FINALIZAR',
                  summary: 'Advertencia',
                  detail: 'Ha ocurrido un error, intentelo mas tarde',
                  life: 3000
                });
              }
            });
          }
        }
      });
    }
    catch (error) {
      this.messageSvc.add({
        severity: 'error',
        summary: 'Advertencia',
        detail: error,
        life: 3000
      });
      this.loadingService.loading(false);
    }
  }
  ExportarExcel() {
    this.loadingService.loading(true);
    this.flujoCajaSvc.descargarArchivo(this.fc.idFC).subscribe(
      response => {
        this.loadingService.loading(false);
        let url = window.URL.createObjectURL(response.body!);
        let anchor = document.createElement('a');
        anchor.download = response.headers.get('File-Name')!;
        anchor.href = url;
        anchor.click();
        window.URL.revokeObjectURL(url);
      }, (err) => {
        this.loadingService.loading(false);
        Swal.fire({
          text: "Ocurrió un error en la descarga del FC.",
          icon: 'warning',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          timer: 3000
        })


        this.loadingService.loading(false);
      });
  }

  descargarArchivo(codigoLaserfiche: any) {
    this.loadingService.loading(true);
    this.hpSvc.obtenerHojaProductoByCodigoLaserfiche(codigoLaserfiche).subscribe(
      response => {
        this.loadingService.loading(false);
        let url = window.URL.createObjectURL(response.body!);
        let anchor = document.createElement('a');
        anchor.download = response.headers.get('File-Name')!;
        anchor.href = url;
        anchor.click();
        window.URL.revokeObjectURL(url);
      }, (err) => {
        Swal.fire({
          text: "Ocurrió un error en la descarga del archivo",
          icon: 'warning',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          timer: 3000
        })

      });
  }

  private mapearFlujoCaja(codEstado): FlujoCajaMasterRequestDto {
    if (this.deudaDPD && this.deudaDPD.length > 0) {
      this.deudaDPD.forEach(item => {
        item.idParametroDpd = item.idParametroDpd.trim();
      });
    }
    if (this.deudaDPI && this.deudaDPI.length > 0) {
      this.deudaDPI.forEach(item => {
        item.idParametroDpi = item.idParametroDpi.trim();
        item.calificacion = /^\d+$/.test(item.calificacion) ? item.calificacion : this.hash.get(item.calificacion);
      });
    }
    let form: FlujoCajaMasterRequestDto = {
      idFC: this.fc.idFC,
      codDestino: this.fc.codDestino,
      nroSolicitud: this.modo == ModoFC.NUEVO ? this.solicitud.numeroSolicitud : this.fc.nroSolicitud,
      nroDocumento: this.modo == ModoFC.NUEVO ? this.solicitud.numeroDocumento : this.fc.nroDocumento,
      codVerParametro: this.modo == ModoFC.NUEVO ? "" : this.fc.codVerParametro,
      comentarioGuf: this.comentarios.comentarioGuf,
      comentarioEsfa: this.comentarios.comentarioEsfa,
      comentarioEra: this.comentarios.comentarioEra,
      comentarioFcd: this.comentarios.comentarioFcd,
      comentarioRse: this.comentarios.comentarioRse,
      comentarioDestinoInversion: this.fc.comentarioDestinoInversion,
      periodoActual: this.fc.periodoActual,
      periodoFC: this.fc.periodoFC,
      idProductoFC: this.fc.idProductoFC,
      sVRendimiento: this.fc.svRendimiento == null ? 0 : this.fc.svRendimiento,
      sVCosto: this.fc.svCosto == null ? 0 : this.fc.svCosto,
      sVPrecio: this.fc.svPrecio == null ? 0 : this.fc.svPrecio,
      precioPromedio: this.fc.precioPromedio == null ? 0 : this.fc.precioPromedio,
      rendimientoPromedio: this.fc.rendimientoPromedio == null ? 0 : this.fc.rendimientoPromedio,
      montoTotalFinanciar: this.fc.montoTotalFinanciar,
      guf: this.guf,
      esfa: this.sharedSvc.convertTreeToList(this.fc.esfaTree),
      era: this.sharedSvc.convertTreeToList(this.fc.eraTree),
      fCDetalle: this.sharedSvc.convertTreeToList(this.fc.fcDetalleTree),
      deudaPD: this.deudaDPD,
      deudaPI: this.deudaDPI,
      planDR: this.pdr,
      flujoCajaHP: this.flujoCajaHP,
      otrosCargos: this.oc,
      rse: this.rse,
      hojaTrabajo: this.fc.hojaTrabajo,
      codEstado: codEstado
    };

    if (form.era && form.era.length > 0) {
      form.era.forEach(item => {
        if (isNaN(item.porcentajeAH)) { item.porcentajeAH = 0; }
        if (isNaN(item.porcentajeAV)) { item.porcentajeAV = 0; }
      });
    }
    return form;
  }

}
