import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ParametroVersion } from 'src/app/models/parametroVersion.interface';
import { DataService } from 'src/app/services/data.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import Swal from 'sweetalert2';
import { LoadingService } from 'src/app/services/comun/loading.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css'],
})
export class DetalleComponent implements OnInit {
  data: any[] = [];
  cols: any[] = [];
  loading: boolean = true;
  activo: boolean = false;

  action: string;
  tab: number;
  key: string;
  tituloTabla: string;
  isChecked: string[];
  mostrarBtnNuevo: boolean = true;

  parametro: ParametroVersion;
  parametro_BK: ParametroVersion;
  parametroVersion: FormGroup;
  codigoVersion: string;

  readonly MODO_DETALLE = "DETALLE";
  readonly MODO_EDITAR = "EDITAR";
  readonly MODO_NUEVO = "NUEVO";
  readonly INVALID = "INVALID";

  constructor(private dataSvc: DataService
    , private router: Router
    , private _fb: FormBuilder
    , private loadingService: LoadingService
    , private store: Store<AppState>) {
    this.parametroVersion = new FormGroup({
      codigoVersion: new FormControl(null, Validators.required),
      descripcionVersion: new FormControl(null, Validators.required),
      fechaUltimaActivacion: new FormControl(''),
      horaUltimaInactivacion: new FormControl(''),
      usuarioUltimaActivacion: new FormControl(''),
      usuarioUltimaInactivacion: new FormControl(''),
      estado: new FormControl(''),
      parametrosGUF: new FormArray([]),
      parametrosDPD: new FormArray([]),
      parametrosDPI: new FormArray([]),
      parametrosRatio: new FormArray([]),
      parametrosTipoCliente: new FormArray([]),
      parametrosRSECondicion: new FormArray([]),
      parametrosComportamiento: new FormArray([]),
      parametrosAlerta: new FormArray([])
    });
  }

  trimAll(obj) {
    for (let prop in obj) {
      if (typeof obj[prop] === "string") {
        obj[prop] = obj[prop].trim();
      } else {
        this.trimAll(obj[prop]);
      }
    }
  }

  ngOnInit(): void {
    let data = this.dataSvc.getData();
    this.cargarListadoParametros(data);
  }

  cargarListadoParametros(data: any) {
    this.loadingService.loading(true);
    this.dataSvc
      .obtenerDetalleParametro(data.codigoVersionActivo)
      .subscribe((response: ParametroVersion) => {
        this.loadingService.loading(false);
        this.trimAll(response);
        this.tab = 1;
        this.activo = data.activo;
        switch (data.modo) {
          case this.MODO_EDITAR:
            this.codigoVersion = response.codigoVersion;
            this.parametroVersion.controls["codigoVersion"].setValue(response.codigoVersion);
            this.parametroVersion.controls["descripcionVersion"].setValue(response.descripcionVersion);
            break;
          case this.MODO_NUEVO:
            response.codigoVersion = data.codigoVersionNuevo;
            response.descripcionVersion = data.descripcion;
            this.codigoVersion = data.codigoVersionNuevo;
            this.parametroVersion.controls["codigoVersion"].setValue(data.codigoVersionNuevo);
            this.parametroVersion.controls["descripcionVersion"].setValue(data.descripcion);
            break;
        }
        //this.parametro_BK = response;
        this.parametro = response;
        if (response.parametrosGUF && response.parametrosGUF.length > 0)
          this.buildParametrosGUF(response.parametrosGUF);
        if (response.parametrosDPD && response.parametrosDPD.length > 0)
          this.buildParametrosDPD(response.parametrosDPD);
        if (response.parametrosDPI && response.parametrosDPI.length > 0)
          this.buildParametrosDPI(response.parametrosDPI);
        if (response.parametrosRatio && response.parametrosRatio.length > 0)
          this.buildParametrosRatio(response.parametrosRatio);
        if (response.parametrosTipoCliente && response.parametrosTipoCliente.length > 0)
          this.buildParametrosTipoCliente(response.parametrosTipoCliente);
        if (response.parametrosRSECondicion && response.parametrosRSECondicion.length > 0)
          this.buildParametrosRSECondicion(response.parametrosRSECondicion);
        if (response.parametrosComportamiento && response.parametrosComportamiento.length > 0)
          this.buildParametrosComportamiento(response.parametrosComportamiento);
        if (response.parametrosAlerta && response.parametrosAlerta.length > 0)
          this.buildParametrosAlerta(response.parametrosAlerta);

        this.parametro_BK = this.parametroVersion.value;
      }, () => {
        this.loadingService.loading(false);
      });
  }

  buildParametrosGUF(parametrosGUF: any[]) {
    const control = <FormArray>this.parametroVersion.get('parametrosGUF');
    parametrosGUF.forEach((item, index) => {
      item.estado = item.estado == '1';
      control.push(
        this._fb.group({
          idParametroGUF: new FormControl(item.idParametroGUF),
          codigoVersion: new FormControl(item.codigoVersion),
          nombreGUF: new FormControl(item.nombreGUF, [Validators.required, Validators.maxLength(35)]),
          editable: new FormControl(item.editable),
          estado: new FormControl(item.estado)
        })
      );
    });
  }

  buildParametrosDPD(parametrosDPD: any[]) {
    const control = <FormArray>this.parametroVersion.get('parametrosDPD');
    parametrosDPD.forEach((item, index) => {
      control.push(
        this._fb.group({
          idParametroDPD: new FormControl(item.idParametroDPD),
          codigoVersion: new FormControl(item.codigoVersion),
          tipoTarjeta: new FormControl(item.tipoTarjeta),
          factorConversion: new FormControl(item.factorConversion, [Validators.required, Validators.min(1)]),
          plazo: new FormControl(item.plazo, [Validators.required, Validators.min(1)]),
          tem: new FormControl(item.tem, Validators.min(1)),
          tea: new FormControl(item.tea, [Validators.required, Validators.min(1)]),
          comentario: new FormControl(item.comentario, Validators.required)
        })
      );
    });
  }

  buildParametrosDPI(parametrosDPI: any[]) {
    const control = <FormArray>this.parametroVersion.get('parametrosDPI');
    parametrosDPI.forEach((item, index) => {
      control.push(
        this._fb.group({
          idParametroDPI: new FormControl(item.idParametroDPI),
          codigoVersion: new FormControl(item.codigoVersion),
          tipoAval: new FormControl(item.tipoAval, Validators.required),
          factorCalificacionNormal: new FormControl(item.factorCalificacionNormal, Validators.required),
          factorCalificacionCPP: new FormControl(item.factorCalificacionCPP, Validators.required),
          factorCalificacionDeficiente: new FormControl(item.factorCalificacionDeficiente, Validators.required),
          factorCalificacionDudoso: new FormControl(item.factorCalificacionDudoso, Validators.required),
          factorCalificacionPerdida: new FormControl(item.factorCalificacionPerdida, Validators.required),
          tem: new FormControl(item.tem),
          tea: new FormControl(item.tea, Validators.required),
          plazo: new FormControl(item.plazo, Validators.required),
          comentario: new FormControl(item.comentario, Validators.required)
        })
      );
    });
  }

  buildParametrosRatio(parametrosRatio: any[]) {
    const control = <FormArray>this.parametroVersion.get('parametrosRatio');
    parametrosRatio.forEach((item, index) => {
      item.estado = item.estado == '1';
      control.push(
        this._fb.group({
          idParametroRatio: new FormControl(item.idParametroRatio),
          codigoVersion: new FormControl(item.codigoVersion),
          nombreRatio: new FormControl(item.nombreRatio),
          regla: new FormControl(item.regla, Validators.required),
          valorParametro: new FormControl(item.valorParametro, Validators.required),
          calculo: new FormControl(item.calculo),
          estado: new FormControl(item.estado)
        })
      );
    });
  }

  buildParametrosTipoCliente(parametrosTipoCliente: any[]) {
    const control = <FormArray>this.parametroVersion.get('parametrosTipoCliente');
    parametrosTipoCliente.forEach((item, index) => {
      control.push(
        this._fb.group({
          idParametroTipoCliente: new FormControl(item.idParametroTipoCliente),
          codigoVersion: new FormControl(item.codigoVersion),
          descripcionTipoCliente: new FormControl(item.descripcionTipoCliente),
          valorParametro: new FormControl(item.valorParametro, [Validators.required, Validators.min(1)]),
          comentario: new FormControl(item.comentario, [Validators.required, Validators.maxLength(50)]),
          estado: new FormControl(true)
        })
      );
    });
  }

  buildParametrosRSECondicion(parametrosRSECondicion: any[]) {
    const control = <FormArray>this.parametroVersion.get('parametrosRSECondicion');
    parametrosRSECondicion.forEach((item, index) => {
      control.push(
        this._fb.group({
          idParametroRSECondicion: new FormControl(item.idParametroRSECondicion),
          codigoVersion: new FormControl(item.codigoVersion),
          rse: new FormControl(item.rse),
          criterio01: new FormControl(item.criterio01),
          criterio02: new FormControl(item.criterio02),
          criterio03: new FormControl(item.criterio03),
          resultado: new FormControl(item.resultado, Validators.required),
          condicion: new FormControl(item.condicion, Validators.required),
          comentario: new FormControl(item.comentario, [Validators.required, Validators.maxLength(50)]),
          estado: new FormControl(true)
        })
      );
    });
  }

  buildParametrosComportamiento(parametrosComportamiento: any[]) {
    const control = <FormArray>this.parametroVersion.get('parametrosComportamiento');
    parametrosComportamiento.forEach((item, index) => {
      control.push(
        this._fb.group({
          idParametroComportamiento: new FormControl(item.idParametroComportamiento),
          codigoVersion: new FormControl(item.codigoVersion),
          tipoCliente: new FormControl(item.tipoCliente),
          descripcionComportamiento: new FormControl(item.descripcionComportamiento, Validators.required),
          comentario: new FormControl(item.comentario, [Validators.required, Validators.maxLength(200)]),
          estado: new FormControl(true)
        })
      );
    });
  }

  buildParametrosAlerta(parametrosAlerta: any[]) {
    const control = <FormArray>this.parametroVersion.get('parametrosAlerta');
    parametrosAlerta.forEach((item, index) => {
      control.push(
        this._fb.group({
          idParametroAlerta: new FormControl(item.idParametroAlerta),
          codigoVersion: new FormControl(item.codigoVersion),
          nombreAlerta: new FormControl(item.nombreAlerta, [Validators.required, Validators.maxLength(120)]),
          calculo: new FormControl(item.calculo),
          regla: new FormControl(item.regla, Validators.required),
          valorParametro: new FormControl(item.valorParametro, Validators.required),
          comentario: new FormControl(item.comentario, [Validators.required, Validators.maxLength(50)]),
          estado: new FormControl(true)
        })
      );
    });
  }

  guardarForm() {
    this.loadingService.loading(true);
    let form = this.parametroVersion.value;
    if (form) {

      if (form.parametrosGUF && form.parametrosGUF.length > 0) {
        form.parametrosGUF.forEach((element) => {
          element.estado = element.estado ? '1' : '0';
        });
      }
      if (form.parametrosRatio && form.parametrosRatio.length > 0) {
        form.parametrosRatio.forEach((element) => {
          element.estado = element.estado ? '1' : '0';
        });
      }
      if (form.parametrosTipoCliente && form.parametrosTipoCliente.length > 0) {
        form.parametrosTipoCliente.forEach((element) => {
          element.estado = element.estado ? '1' : '0';
        });
      }
      if (form.parametrosRSECondicion && form.parametrosRSECondicion.length > 0) {
        form.parametrosRSECondicion.forEach((element) => {
          element.estado = element.estado ? '1' : '0';
        });
      }
      if (form.parametrosComportamiento && form.parametrosComportamiento.length > 0) {
        form.parametrosComportamiento.forEach((element) => {
          element.estado = element.estado ? '1' : '0';
        });
      }
      if (form.parametrosAlerta && form.parametrosAlerta.length > 0) {
        form.parametrosAlerta.forEach((element) => {
          element.estado = element.estado ? '1' : '0';
        });
      }
      const parametrosGUF = <FormArray>this.parametroVersion.get('parametrosGUF');
      const parametrosDPD = <FormArray>this.parametroVersion.get('parametrosDPD');
      const parametrosDPI = <FormArray>this.parametroVersion.get('parametrosDPI');
      const parametrosRatio = <FormArray>this.parametroVersion.get('parametrosRatio');
      const parametrosTipoCliente = <FormArray>this.parametroVersion.get('parametrosTipoCliente');
      const parametrosRSECondicion = <FormArray>this.parametroVersion.get('parametrosRSECondicion');
      const parametrosComportamiento = <FormArray>this.parametroVersion.get('parametrosComportamiento');
      const parametrosAlerta = <FormArray>this.parametroVersion.get('parametrosAlerta');

      let validacionMensaje = '';
      let isValidForm = true;

      if (form.descripcionVersion === '') {
        validacionMensaje += ' - Descripción <br>'
        isValidForm = false;
      }

      if (parametrosGUF.status === this.INVALID) {
        validacionMensaje += ' - Gastos Unidad Familiar <br>';
        isValidForm = false;
      }
      if (parametrosDPD.status === this.INVALID) {
        validacionMensaje += ' - Deuda Potencial Directa <br>';
        isValidForm = false;
      }
      if (parametrosDPI.status === this.INVALID) {
        validacionMensaje += ' - Deuda Potencial Indirecta <br>';
        isValidForm = false;
      }
      if (parametrosRatio.status === this.INVALID) {
        validacionMensaje += ' - Ratios <br>';
        isValidForm = false;
      }
      if (parametrosTipoCliente.status === this.INVALID) {
        validacionMensaje += ' - Tipo Cliente <br>';
        isValidForm = false;
      }
      if (parametrosRSECondicion.status === this.INVALID) {
        validacionMensaje += ' - RSE Condiciones <br>';
        isValidForm = false;
      }
      if (parametrosComportamiento.status === this.INVALID) {
        validacionMensaje += ' - Comportamiento <br>';
        isValidForm = false;
      }
      if (parametrosAlerta.status === this.INVALID) {
        validacionMensaje += ' - Alertas <br>';
        isValidForm = false;
      }

      if (isValidForm) {
        this.loadingService.loading(true);
        this.dataSvc
          .registrarParametroVersion(form)
          .subscribe((response: any) => {
            if (response) {
              this.loadingService.loading(false);
              if (response) {
                Swal.fire({
                  text: "Los parámetros se guardaron exitosamente",
                  icon: 'success',
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: 'Aceptar',
                  allowOutsideClick: false,
                  allowEscapeKey: false,
                  timer: 3000
                }).then((result) => {
                  if (result.isConfirmed || result.isDismissed) {
                    this.router.navigate(['/mantenimiento-parametros']);
                  }
                });
              } else {
                Swal.fire({
                  icon: 'error',
                  text: 'Ha ocurrido un error, intentelo mas tarde'
                });
              }
            }
          }, () => {
            this.loadingService.loading(false);
          });
      } else {
        Swal.fire({
          title: 'Completar todos los datos obligatorios',
          icon: 'error',
          html: validacionMensaje
        });
        this.loadingService.loading(false);
      }
    }
  }
}