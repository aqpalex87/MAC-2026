import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { CommonData, DestinoCredito, FlujoCajaHT } from 'src/app/models/flujocaja.interface';
import { selectFlujoCajaHT } from 'src/app/redux/selectors/flujo-caja/flujo.caja.selectors';
import { ModalHojaTrabajoComponent } from './modal-hoja-trabajo/modal-hoja-trabajo.component';
import * as FlujoCajaActions from "../../../../redux/actions/flujo-caja/flujo.caja.actions";
import { HojaProductoService } from 'src/app/services/hoja-producto.service';
import Swal from 'sweetalert2';
import { LoadingService } from 'src/app/services/comun/loading.service';
import dayjs from 'dayjs';

@Component({
  selector: 'app-hoja-trabajo',
  templateUrl: './hoja-trabajo.component.html',
  styleUrls: ['./hoja-trabajo.component.css']
})
export class hojaTrabajoComponent implements OnInit {

  @Input() commonData: CommonData;

  mostrarAdjuntarArchivo = true;
  data: FlujoCajaHT[] = [];
  isEditableFC = false;
  descargarBool: boolean = true;

  constructor(private store: Store<AppState>,
    public dialog: MatDialog,
    private hojaProductoSrv: HojaProductoService
    , private loadingService: LoadingService
  ) { }

  ngOnInit(): void {
    this.descargarBool = true;
    this.store.select(selectFlujoCajaHT).subscribe({
      next: (data: FlujoCajaHT[]) => {
        this.data = data;
      }
    });

    this.store.select("shared").subscribe((res) => {
      this.isEditableFC = !res.editableFC;
    })

  }

  abrirModal() {

    switch (this.commonData.codDestino) {
      case DestinoCredito.SOSTENIMIENTO:
        this.commonData.gridTitle = 'AGREGAR HOJA DE TRABAJO';
        break;
      default:
        this.commonData.gridTitle = 'AGREGAR NUEVA VERSION DE FC';
        this.commonData.textButton = 'Nueva Versión'
        break;
    }

    const dialogRef = this.dialog.open(ModalHojaTrabajoComponent, {
      width: '600px',
      data: this.commonData.gridTitle,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.agregarFila(result);
      }
    });
  }


  agregarFila(hojaTrabajo: FlujoCajaHT) {
    this.descargarBool = false;
    const newItem: FlujoCajaHT = {
      id: 0,
      codigoLasefiche: 0,
      comentario: hojaTrabajo.comentario,
      idLaserfiche: 0,
      estado: '1',
      fechaRegistro: this.obtenerFechaActual(),
      horaRegistro: this.obtenerHoraActual(),
      usuarioRegistro: this.getUser(),
      nombre: hojaTrabajo.nombre,
      archivoBytes: hojaTrabajo.archivoBytes,
      extension: hojaTrabajo.extension
    };

    this.data = [newItem];
    this.mostrarAdjuntarArchivo = false;
    this.store.dispatch(FlujoCajaActions.setHojaTrabajo({ hojaTrabajo: this.data }))
  }

  ConvertirFecha(value: any) {
    var result = dayjs(value).format('DD/MM/YYYY');
    return result;
  }



  convertirHora(value: string): string {
    const horas = value.substring(0, 2);
    const minutos = value.substring(2, 4);
    const segundos = value.substring(4, 6);

    return `${horas}:${minutos}`;
  }

  obtenerFechaActual() {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    let MM = mm.toString();
    let DD = dd.toString();
    if (dd < 10) DD = '0' + dd;
    if (mm < 10) MM = '0' + mm;


    let diaf = today.getDate().toString().padStart(2, '0');
    let mesf = (today.getMonth() + 1).toString().padStart(2, '0');
    let aniof = today.getFullYear();
    return diaf + '/' + mesf + '/' + aniof;

    //return DD + '/' + MM + '/' + yyyy;

  }

  obtenerHoraActual() {
    const t = new Date()
    let minutes = t.getMinutes();
    let minutesFormatted = minutes.toString().length == 1 ? '0' + minutes : minutes.toString();
    return t.getHours() + minutesFormatted;
    // return (t.getHours() + ':' + minutesFormatted);
  }

  descargarArchivo(codigoLaserfiche: string) {
    this.loadingService.loading(true);
    this.hojaProductoSrv.obtenerHojaProductoByCodigoLaserfiche(codigoLaserfiche).subscribe(
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

  getUser() {
    const usuarioWeb = localStorage.getItem('UsuarioWeb');
    return usuarioWeb;
  }

  obtenerDescripcionEstado(estado) {
    if (estado === "1") {
      return "Activo";
    }
    return "Inactivo";
  }

  agregarHojaTrabajo() {
    this.abrirModal();
  }

}
