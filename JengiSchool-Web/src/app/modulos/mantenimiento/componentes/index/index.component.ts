import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { ParametroVersion } from 'src/app/models/parametroVersion.interface';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { ParametroNuevo } from 'src/app/models/shared.interface';
import * as SharedActions from '../../../../redux/actions/shared/shared.actions';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class IndexComponent implements OnInit {
  list: FormGroup;
  data: ParametroVersion[] = [];
  loading: boolean = true;
  readonly MODO_DETALLE = "DETALLE";
  readonly MODO_EDITAR = "EDITAR";
  readonly MODO_NUEVO = "NUEVO";
  constructor(
    private router: Router,
    private _fb: FormBuilder,
    private dataSvc: DataService,
    private store: Store<AppState>
  ) {

    this.list = this._fb.group({
      data: new FormArray([])
    });
  }

  ngOnInit() {
    this.dataSvc.obtenerListadoParametros().subscribe((response: ParametroVersion[]) => {
      this.buildList(response);
      this.loading = false;
    });
  }

  buildList(parametroVersion: ParametroVersion[]) {
    if (parametroVersion && parametroVersion.length > 0) {
      const control = <FormArray>this.list.get('data');
      parametroVersion.forEach(item => {
        control.push(
          this._fb.group({
            codigoVersion: new FormControl(item.codigoVersion),
            descripcionVersion: new FormControl(item.descripcionVersion),
            estado: new FormControl({ value: item.estado == '1', disabled: true }),
            fechaRegistro: new FormControl(item.fechaRegistro),
            fechaInactivacion: new FormControl(item.fechaUltimaInactivacion),
            fechaUltimaActivacion: new FormControl(item.fechaUltimaActivacion),
            fechaUltimaInactivacion: new FormControl(item.fechaUltimaInactivacion),
            usuarioRegistro: new FormControl(item.usuarioRegistro),
            usuarioUltimaActivacion: new FormControl(item.usuarioUltimaActivacion)
          })
        );
      });
    }
  }

  get dataArray(): FormArray {
    return this.list.get('data') as FormArray;
  }

  verDetalle(parametro: any) {
    let data: ParametroNuevo = {
      modo: this.MODO_EDITAR,
      codigoVersionActivo: parametro.codigoVersion,
      codigoVersionNuevo: '',
      activo: false,
      descripcion: parametro.descripcionVersion
    }
    this.dataSvc.setData(data);
    this.router.navigate(['/mantenimiento-parametros/detalle']);
  }

  activarVersion(index_row: number, codigoVersion: any) {
    const form = <FormArray>this.list.get('data');
    let indice_anterior = 0;
    form.controls.forEach((element, index) => {
      if (element['controls']['estado'].value)
        indice_anterior = index;
      element['controls']['estado'].setValue(false);
    });
    const element = <FormArray>this.list.get('data')['controls'];
    Swal.fire({
      text: "¿ Desea activar esta versión de parámetros ?",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dataSvc
          .actualizarEstadoParametroVersion(codigoVersion, "1")
          .subscribe({
            next: response => {
              const control = element[response ? index_row : indice_anterior]['controls'];
              control['estado'].setValue(true);
              if (response) {
                Swal.fire('Versión Activada', '', 'success');
              } else {
                Swal.fire({
                  icon: 'error',
                  text: 'Ha ocurrido un error, intentelo mas tarde'
                });
              }
            },
            error: error => {
              const control = element[indice_anterior]['controls'];
              control['estado'].setValue(true);
              Swal.fire({
                icon: 'error',
                text: 'Ha ocurrido un error, intentelo mas tarde'
              });
            }
          });
      } else {
        const control = element[indice_anterior]['controls'];
        control['estado'].setValue(true);
      }
    });
  }

  nuevoRegistro() {
    this.dataSvc.setData(null);
    this.dataSvc.obtenerNuevoCodigoVersion().subscribe((response: any) => {
      if (response) {
        let data: ParametroNuevo = {
          modo: this.MODO_NUEVO,
          codigoVersionActivo: response.codigoVersionActivo,
          codigoVersionNuevo: response.codigoVersionNuevo,
          activo: true,
          descripcion: ''
        }
        this.dataSvc.setData(data);
        this.router.navigate(['/mantenimiento-parametros/detalle']);
      } else {
        Swal.fire({
          icon: 'error',
          text: 'Ha ocurrido un error, intentelo mas tarde'
        });
      }
    });
  }
}
