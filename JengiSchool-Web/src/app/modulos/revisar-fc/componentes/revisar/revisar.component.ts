import { Component, OnInit } from '@angular/core';
import { Message, MessageService } from 'primeng/api';
import { GlobalConstants } from 'src/app/shared/common/globalContants';
import { FlujoCajaFC,SolicitudRevisarFCFiltro, ActualizarRevisarFC  } from 'src/app/models/solicitudesFlujoCaja'; 
import { ActivatedRoute, Router } from '@angular/router';
import { FlujoCajaService } from 'src/app/services/flujo-caja.service';
import { DatosFC } from 'src/app/models/dataseguridad.interface';
import { SecurityService } from 'src/app/services/security.service';

@Component({
  selector: 'app-revisar',
  templateUrl: './revisar.component.html',
  styleUrls: ['./revisar.component.css'],
  providers: [MessageService]
})
export class RevisarComponent implements OnInit {
  data: FlujoCajaFC[] = [];
  filtro: SolicitudRevisarFCFiltro;
  mensajes: Message[] = [];
  loading: boolean = false;
  flagRefresh: boolean = true;
  constructor(
    private router: Router,
    private messageService: MessageService,
    private flujoCajaService : FlujoCajaService,
    private route: ActivatedRoute,
    private securityService: SecurityService,
  ){
  }
  ngOnInit(): void {
    this.filtro = {
      idFlujoCaja: "",
      numeroSolicitud: "",
      numeroCredito:"",
      numeroDocumento:"",
      nombres:"",
      estadoFlujoCaja:"2",
    };

    let isSuccess = this.route.snapshot.params['isSuccess'];
    if(isSuccess == '1'){
      this.mostrarMensajeExitoso('Observación registrada con éxito.');
    }
  }

  navegarDetalleFc(objeto: FlujoCajaFC ):void {
    let datos: DatosFC = {
      idFlujoCaja: objeto.idFlujoCaja,
      modo: "DETALLE",
      numeroDocumento: objeto.numeroDocumento,
      numeroSolicitud: objeto.numeroSolicitud,
      vista: 'RE'
    }
    this.securityService.guardarDatosFC(datos);
    this.router.navigateByUrl('/flujo-caja/observar');
  }

  buscar(): void{
    try{
      if(this.validarFiltro()){
        this.mostrarLoading(true);
        this.obtenerFlujosCaja();
        this.actualizarVisibilidad();
      }
      else{
        this.mostrarMensaje("Ingrese al menos un criterio de búsqueda.");
      }
    }
    catch {
      this.mostrarMensaje("Su solicitud no pudo ser completada.");
      this.mostrarLoading(false);
    }
    this.mostrarLoading(false);
  }

  actualizarVisibilidad(): void {
    this.flagRefresh = false;
    setTimeout(() => this.flagRefresh = true, 0);
  }

  mostrarMensaje(mensaje: string){
    this.mensajes = [{severity: "warn", summary:"", detail: mensaje}];
    setTimeout(()=> {
      this.mensajes = []
    }, 3500);
  }

  mostrarMensajeExitoso(mensaje: string){
    this.mensajes = [{severity: "success", summary:"", detail: mensaje}];
    setTimeout(()=> {
      this.mensajes = []
    }, 3500);
  }


  validarFiltro(): boolean{
    return (+this.filtro.idFlujoCaja > 0|| 
    +this.filtro.numeroSolicitud > 0 || 
    +this.filtro.numeroCredito > 0 || 
    this.filtro.numeroDocumento?.trim() != "" || 
    this.filtro.nombres?.trim() != "");
  }

  mostrarLoading(loading: boolean){
    setTimeout(() => {
      this.loading = loading
    }, 100);
  }

  obtenerFlujosCaja(): void{
    this.flujoCajaService.obtenerFlujosCaja(this.obtenerFiltroRequest())
    .subscribe((response: FlujoCajaFC[]) => {
      this.data = response;
      this.mostrarLoading(false);
    },
    err => {
      this.mostrarMensaje("Su solicitud no pudo ser completada.");
      this.mostrarLoading(false);
    });
  }

  obtenerFiltroRequest(): SolicitudRevisarFCFiltro{
    const filtroRequest : SolicitudRevisarFCFiltro = {
      idFlujoCaja : (+this.filtro.idFlujoCaja > 0? this.filtro.idFlujoCaja : "0" ),
      numeroSolicitud : (+this.filtro.numeroSolicitud > 0? this.filtro.numeroSolicitud : "0" ),
      numeroCredito : (+this.filtro.numeroCredito > 0? this.filtro.numeroCredito : "0" ),
      numeroDocumento : this.filtro.numeroDocumento,
      nombres : this.filtro.nombres,
      estadoFlujoCaja : this.filtro.estadoFlujoCaja,
    };
    return filtroRequest;
  }

  obtenerDescripcionEstadoFlujoCaja(estadoFlujoCaja:string):string{
    if(estadoFlujoCaja == GlobalConstants.FlujoCajaPendiente){
      return GlobalConstants.FlujoCajaPendienteDescripcion;
    }
    else if(estadoFlujoCaja == GlobalConstants.FlujoCajaFinalizado){
      return GlobalConstants.FlujoCajaFinalizadoDescripcion;
    }
    else if(estadoFlujoCaja == GlobalConstants.FlujoCajaObservado){
      return GlobalConstants.FlujoCajaObservadoDescripcion;
    }
    else{
      return GlobalConstants.FlujoCajaNoDefinidoDescripcion; 
    }
  }
 

  verificarBotonVerDetalle(solicitudCredito: FlujoCajaFC): boolean{
    return solicitudCredito.idFlujoCaja > 0;
  }
 

}
