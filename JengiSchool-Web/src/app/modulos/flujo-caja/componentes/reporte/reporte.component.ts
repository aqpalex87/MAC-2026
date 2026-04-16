import { Component, OnInit } from '@angular/core';
import { Message, MessageService } from 'primeng/api';
import { Anio, FlujoCajaReporteFiltro } from 'src/app/models/flujocaja.interface';
import { FlujoCajaService } from 'src/app/services/flujo-caja.service';
import { GlobalConstants } from 'src/app/shared/common/globalContants';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import { timeInterval } from 'rxjs';
import { LoadingService } from 'src/app/services/comun/loading.service';

@Component({
  selector: 'app-flujo-caja-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css'],
  providers: [MessageService]
})
export class FlujoCajaReporteComponent implements OnInit {
  //Campos de información
  filtro: FlujoCajaReporteFiltro;
  mensajes: Message[] = [];
  loading: boolean = false;
  anioActual: string = dayjs().format('YYYY');
  minFechaInicio: Date;
  maxFechaInicio: Date;
  minFechaFin: Date;
  maxFechaFin: Date;

  actualDate: Date;

  anios: Anio[] = [];
  // anios: Anio[] = [
  //   { code: '2020' },
  //   { code: '2021' },
  //   { code: '2022' },
  //   { code: '2023' }
  // ];

  selectedAnio: Anio = { code: this.anioActual };

  constructor(
    private messageService: MessageService,
    private flujoCajaService: FlujoCajaService,
    private loadingService: LoadingService
  ) { }

  ngOnInit(): void {

    this.loadingService.loading(true);

    this.obtenerAnios();

    this.actualDate = this.obtenerFechaActual();
    this.filtro = {
      fechaFin: this.actualDate,
      fechaInicio: dayjs(this.actualDate).subtract(12, 'month').add(1, 'day').toDate()
    };

    this.setMinMaxDate(this.filtro.fechaInicio, this.filtro.fechaFin);
    this.selectedAnio = { code: '--' }
  }

  obtenerAnios(){
    this.flujoCajaService.obtenerAniosFromFC().subscribe((res) => {
      this.anios.push({code:'--'})
      res.forEach(e => {
        this.anios.push({code:e.code})
      });
      this.loadingService.loading(false);
    });
  }
  inicioSelectedDate(dateSelected: Date) {
    this.filtro.fechaInicio = dateSelected;
    const fechaFinTemp = dayjs(this.filtro.fechaInicio).add(12, 'month').subtract(1, 'day').toDate();
    this.minFechaInicio = this.filtro.fechaInicio
    this.maxFechaInicio = this.filtro.fechaFin;

    this.minFechaFin = this.filtro.fechaInicio;
    this.maxFechaFin = fechaFinTemp >= this.actualDate ? this.actualDate : fechaFinTemp;
  }

  finSelectedDate(dateSelected: Date) {
    this.filtro.fechaFin = dateSelected;
    const fechaInicioTemp = dayjs(this.filtro.fechaFin).subtract(12, 'month').add(1, 'day').toDate();

    this.minFechaInicio = fechaInicioTemp;
    this.maxFechaInicio = this.filtro.fechaFin;

    this.minFechaFin = this.filtro.fechaInicio;
    this.maxFechaFin = this.filtro.fechaFin;

    this.selectedAnio = {
      code: dayjs(dateSelected).year().toString()
    };
  }

  private setMinMaxDate(inicio: Date, fin: Date) {
    this.minFechaInicio = inicio;
    this.maxFechaInicio = fin;
    this.maxFechaFin = fin;
    this.minFechaFin = inicio;
  }

  selectedYear({ value }: any) {
    this.filtro.fechaFin = this.actualDate;
    this.filtro.fechaInicio = dayjs(this.filtro.fechaFin).subtract(12, 'month').add(1, 'day').toDate();
    if (value.code < this.anioActual) {
      this.filtro.fechaFin = dayjs(`${value.code}1231`).toDate();
      this.filtro.fechaInicio = dayjs(this.filtro.fechaFin).subtract(12, 'months').add(1, 'day').toDate();
    }
    this.setMinMaxDate(this.filtro.fechaInicio, this.filtro.fechaFin);
  }

  exportar(): void {

    try {
      if (this.validarFiltro()) {
        this.loadingService.loading(true);
        // this.obtenerFlujosCaja();

        this.flujoCajaService.descargarReporteFC(
          dayjs(this.filtro.fechaInicio).format('YYYYMMDD'),
          dayjs(this.filtro.fechaFin).format('YYYYMMDD'),
        ).subscribe(
          data => {
            this.loadingService.loading(false);
            let uri = window.URL.createObjectURL(data.body!);
            let element = document.createElement('a');
            element.download = data.headers.get('File-Name')!;
            element.href = uri;
            element.click();
            window.URL.revokeObjectURL(uri);
          }, (err) => {
            Swal.fire({
              text: "Ocurrió un error en la descarga del reporte FC.",
              icon: 'warning',
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              timer: 3000
            })
            this.loadingService.loading(false);
          });
      }
    }
    catch {
      this.mostrarMensaje("Su solicitud no pudo ser completada.");
      this.mostrarLoading(false);
    }
    // this.mostrarLoading(false);
    // this.loadingService.loading(false);
  }

  limpiar(): void {
    this.selectedAnio = { code: '--' }
    this.filtro = {
      fechaInicio: null,
      fechaFin: null
    };
  }

  mostrarMensaje(mensaje: string) {
    this.mensajes = [{ severity: "error", summary: "Error", detail: mensaje }];
    setTimeout(() => {
      this.mensajes = []
    }, 3500);
  }

  validarFiltro(): boolean {
    if (this.filtro.fechaInicio == null &&
      this.filtro.fechaFin == null) {
      this.mostrarMensaje("Ingrese al menos un criterio de búsqueda.");
      return false;
    }
    else if (this.filtro.fechaInicio != null &&
      this.filtro.fechaFin &&
      this.filtro.fechaInicio > this.filtro.fechaFin) {
      this.mostrarMensaje("La fecha inicio debe ser menor o igual la fecha fin.");
      return false;
    }
    // if ((this.filtro.fechaInicio != null &&
    //   this.filtro.fechaInicio < this.obtenerFechaLimite()) ||
    //   (this.filtro.fechaFin != null &&
    //     this.filtro.fechaFin < this.obtenerFechaLimite())) {
    //   this.mostrarMensaje("La fecha máxima de consulta es 6 meses antes de la fecha actual.");
    //   return false;
    // }

    // else(this.selectedAnio.code === '--'){
    //   this.mostrarMensaje("Debe seleccionar un año o un rango de fechas.");
    //   return false;
    // }
    return true;
  }

  mostrarLoading(loading: boolean): void {
    setTimeout(() => {
      this.loading = loading
    }, 100);
  }

  obtenerFechaLimite(): Date {
    const meseAnterioes = 6;
    var fecha = this.obtenerFechaActual();
    fecha.setMonth(fecha.getMonth() - meseAnterioes);
    return fecha;
  }

  // obtenerFlujosCaja(): void{
  //   this.flujoCajaService
  //   .obtenerFlujosCaja(this.obtenerFiltroRequest())
  //   .subscribe((response: FlujoCaja[]) => {
  //     this.data = response;
  //     this.mostrarLoading(false);
  //   },
  //   err => {
  //     this.mostrarMensaje("Su solicitud no pudo ser completada.");
  //   });
  // }

  // obtenerFiltroRequest(): FlujoCajaConsultaFiltro{
  //   const filtroRequest : FlujoCajaConsultaFiltro = {
  //     idFlujoCaja : (+this.filtro.idFlujoCaja > 0? this.filtro.idFlujoCaja : "0" ),
  //     numeroSolicitud : (+this.filtro.numeroSolicitud > 0? this.filtro.numeroSolicitud : "0" ),
  //     numeroCredito : (+this.filtro.numeroCredito > 0? this.filtro.numeroCredito : "0" ),
  //     numeroDocumento : this.filtro.numeroDocumento,
  //     nombres : this.filtro.nombres
  //   };
  //   return filtroRequest;
  // }

  obtenerFechaActual(): Date {
    return dayjs().toDate();
    // const fecha = new Date;
    // const fechaSinHora = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
    // return fechaSinHora;
  }


}
