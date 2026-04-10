import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message, MessageService } from 'primeng/api';
import { DatosFC } from 'src/app/models/dataseguridad.interface';
import { FlujoCaja, FlujoCajaFiltro } from 'src/app/models/flujocaja.interface';
import { FlujoCajaFC } from 'src/app/models/solicitudesFlujoCaja';
import { FlujoCajaService } from 'src/app/services/flujo-caja.service';
import { HojaProductoService } from 'src/app/services/hoja-producto.service';
import { SecurityService } from 'src/app/services/security.service';
import { GlobalConstants } from 'src/app/shared/common/globalContants';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-flujo-caja-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: [ './consulta.component.css' ],
  providers: [ MessageService ]
})

export class FlujoCajaConsultaComponent implements OnInit {
  //Campos de información
  data: FlujoCaja[] = [];
  filtro: FlujoCajaFiltro;
  mensajes: Message[] = [];
  loading: boolean = false;
  flagRefresh: boolean = true;

  constructor(
    private messageService: MessageService,
    private flujoCajaService: FlujoCajaService,
    private router: Router,
    private securityService: SecurityService,
    private hpSvc: HojaProductoService
  ) { }

  ngOnInit(): void {
    this.filtro = {
      idFlujoCaja: "",
      numeroSolicitud: "",
      numeroDocumento: "",
      nombres: "",
      numeroCredito: "",
      estadoFlujoCaja: ""
    };
  }

  buscar(): void {
    try {
      if (this.validarFiltro()) {
        this.mostrarLoading(true);
        this.obtenerFlujosCaja();
        this.actualizarVisibilidad();
      }
      else {
        this.mostrarMensaje("Ingrese al menos un criterio de búsqueda.");
      }
    }
    catch {
      this.mostrarMensaje("Su solicitud no pudo ser completada.");
    }
    this.mostrarLoading(false);
  }

  mostrarMensaje(mensaje: string) {
    this.mensajes = [ { severity: "warn", summary: "", detail: mensaje } ];
    setTimeout(() => {
      this.mensajes = []
    }, 3500);
  }

  actualizarVisibilidad(): void {
    this.flagRefresh = false;
    setTimeout(() => this.flagRefresh = true, 0);
  }

  validarFiltro(): boolean {
    return (+this.filtro.idFlujoCaja > 0 ||
      +this.filtro.numeroSolicitud > 0 ||
      +this.filtro.numeroCredito > 0 ||
      this.filtro.numeroDocumento?.trim() != "" ||
      this.filtro.nombres?.trim() != "");
  }

  mostrarLoading(loading: boolean) {
    setTimeout(() => {
      this.loading = loading
    }, 100);
  }

  obtenerFlujosCaja(): void {
    this.flujoCajaService
      .obtenerFlujosCaja(this.obtenerFiltroRequest())
      .subscribe((response: FlujoCaja[]) => {
        this.data = response;
        this.mostrarLoading(false);
      },
        err => {
          this.mostrarMensaje("Su solicitud no pudo ser completada.");
          this.mostrarLoading(false);
        });
  }

  obtenerFiltroRequest(): FlujoCajaFiltro {
    const filtroRequest: FlujoCajaFiltro = {
      idFlujoCaja: (+this.filtro.idFlujoCaja > 0 ? this.filtro.idFlujoCaja : "0"),
      numeroSolicitud: (+this.filtro.numeroSolicitud > 0 ? this.filtro.numeroSolicitud : "0"),
      numeroCredito: (+this.filtro.numeroCredito > 0 ? this.filtro.numeroCredito : "0"),
      numeroDocumento: this.filtro.numeroDocumento,
      nombres: this.filtro.nombres,
      estadoFlujoCaja: ""
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

  verDetalleFC(objeto: FlujoCajaFC) {
    let datos: DatosFC = {
      idFlujoCaja: objeto.idFlujoCaja,
      modo: 'DETALLE',
      numeroDocumento: objeto.numeroDocumento,
      numeroSolicitud: objeto.numeroSolicitud,
      vista: 'CO'
    }
    this.securityService.guardarDatosFC(datos);

    if (objeto.idFlujoCaja > 0) {
      this.router.navigateByUrl('/consultaflujocaja');
    }
  }

  descargar(idFC: number) {
    this.loading = true;

    this.flujoCajaService.descargarArchivo(idFC).subscribe(
      response => {
        this.loading = false;
        let url = window.URL.createObjectURL(response.body!);
        let anchor = document.createElement('a');
        anchor.download = response.headers.get('File-Name')!;
        anchor.href = url;
        anchor.click();
        window.URL.revokeObjectURL(url);
      }, (err) => {
        Swal.fire({
          text: "Ocurrió un error en la descarga del FC.",
          icon: 'warning',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          timer: 3000
        })


        this.loading = false;
      });
  }

  descargarArchivoLaserfiche(codigoLaserfiche:any) {
    this.loading = true;
    this.hpSvc.obtenerHojaProductoByCodigoLaserfiche(codigoLaserfiche).subscribe(
      response => {
        this.loading = false;
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
}
