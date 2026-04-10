import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import {
  DeudaDirecta,
  DeudaIndirecta,
} from '../../../models/flujocaja.interface';
import * as FlujoCajaActions from '../../../redux/actions/flujo-caja/flujo.caja.actions';
import {
  selectDeudasDirectas,
  selectDeudasIndirectas,
} from 'src/app/redux/selectors/flujo-caja/flujo.caja.selectors';
import { ModalService } from '../../flujo-caja/modal/modal.service';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { ParametroVersion } from 'src/app/models/parametroVersion.interface';

interface ParametroDPD {
  codigoVersion?: string;
  comentario?: string;
  factorConversion?: number;
  idParametroDPD?: number;
  plazo?: number;
  tEA?: number;
  tEM?: number;
  tipoTarjeta?: string;
}
interface ParametroDPI {
  codigoVersion?: string;
  comentario?: string;
  factorCalificacionCPP?: number;
  factorCalificacionDeficiente?: number;
  factorCalificacionDudoso?: number;
  factorCalificacionNormal?: number;
  factorCalificacionPerdida?: number;
  idParametroDPI?: number;
  plazo?: number;
  tEA?: number;
  tEM?: number;
  tipoAval?: string;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {
  //main: FormGroup;
  valorDPD = 0;
  valorDPI = 0; // Valor que se poblará en el input
  borderColor = 'red';
  parametroDPD: ParametroVersion;
  parametroDPI: ParametroVersion;
  DPD: ParametroDPD;
  DPI: ParametroDPI;
  miObjeto: any = [];
  data: ParametroVersion[] = [];
  deudadirecta: DeudaDirecta[] = [];
  deudaindirecta: DeudaIndirecta[] = [];
  _deuda: DeudaDirecta[] = [];
  isChecked: string[];
  loading: boolean = true;
  showMdl: boolean = false;
  activityValues: number[] = [0, 100];
  deudasDirectas$ = this.store.pipe(select(selectDeudasDirectas));
  deudasIndirectas$ = this.store.pipe(select(selectDeudasIndirectas));

  constructor(
    private store: Store,
    private modalService: ModalService,
    private router: Router,
    private dataSvc: DataService
  ) { }

  ngOnInit(): void {

    // this.DPD = null;
    // this.miObjeto = [];
    // this.deudadirecta = [];
    // this.dataSvc
    //   .obtenerListadoParametrosDummy()
    //   .subscribe((data: ParametroVersion) => {
    //     this.miObjeto = data;

    //     this.parametroDPD = data[1];
    //     const _parametrosDPD = this.parametroDPD.parametrosDPD;
    //     if (_parametrosDPD && _parametrosDPD.length > 0) {
    //       const oDPD = _parametrosDPD[0];
    //       this.DPD = {
    //         codigoVersion: oDPD.codigoVersion,
    //         comentario: oDPD.comentario,
    //         factorConversion: oDPD.factorConversion,
    //         idParametroDPD: oDPD.idParametroDPD,
    //         plazo: oDPD.plazo,
    //         tEA: oDPD.tEA,
    //         tEM: oDPD.tEM,
    //         tipoTarjeta: oDPD.tipoTarjeta,
    //       };
    //     }
    //     this.parametroDPI = data[1];
    //     const _parametroDPI = this.parametroDPI.parametrosDPI;
    //     if (_parametroDPI && _parametroDPI.length > 0) {
    //       const oDPI = _parametroDPI[0];
    //       this.DPI = {
    //         codigoVersion: oDPI.codigoVersion,
    //         comentario: oDPI.comentario,
    //         factorCalificacionCPP: oDPI.factorCalificacionCPP,
    //         factorCalificacionDeficiente: oDPI.factorCalificacionDeficiente,
    //         factorCalificacionDudoso: oDPI.factorCalificacionDudoso,
    //         factorCalificacionNormal: oDPI.factorCalificacionNormal,
    //         factorCalificacionPerdida: oDPI.factorCalificacionPerdida,
    //         idParametroDPI: oDPI.idParametroDPI,
    //         plazo: oDPI.plazo,
    //         tEA: oDPI.tEA,
    //         tEM: oDPI.tEM,
    //         tipoAval: oDPI.tipoAval,
    //       };
    //     }
    //   });
    //  this.store.select(selectDeudasDirectas).subscribe((deudadirecta) => {
    //  this.deudadirecta = deudadirecta;
    //  });

    // this.store.select(selectDeudasIndirectas).subscribe((deudaindirecta) => {
    //   this.deudaindirecta = deudaindirecta;
    // });
  }


  editarDeudaDirecta(deudadirecta: ParametroDPD): void {
    this.valorDPD = 0;
    const DatosParametro = deudadirecta;
    const _deudaEditando: DeudaDirecta = {
      consumoCon: null,
      consumoSin: null,
      microEmpresa: null,
      pequeEmpresa: null,
      cuotaPotencialDirecta: 0,
      tarjetaLineasCredito: 'Tarjeta y Líneas de Crédito',
      factorConversion: DatosParametro.factorConversion,
      interesMensual: DatosParametro.tEM,
      numeroPlazo: DatosParametro.plazo
    };
    const dialogRef = this.modalService.abrirModalDeudaDirecta(_deudaEditando);

    dialogRef.afterClosed().subscribe((_deudaEditando) => {
      if (_deudaEditando) {

        this.valorDPD = _deudaEditando.cuotaPotencialDirecta;
        this.borderColor = 'green';

        this.store.dispatch(
          FlujoCajaActions.updateDeudaDirecta({
            deudadirecta: _deudaEditando,
          })
        );
      }
    });
  }

  verDetalle(data: DeudaDirecta) {
    this.router.navigate(['/mantenimiento-parametros/detalle']);
  }

  editarDeudaIndirecta(deudaindirecta: ParametroDPI): void {
    const DatosParametro = deudaindirecta;
    const _deudaEditando: DeudaIndirecta = {
      avalMYPE: null,
      avalConsumo: null,
      CartaFianza: null,
      avalConsumoCombo: null,
      avalMYPECombo: null,
      CartaFianzaCombo: null,
      interesMensual: DatosParametro.tEM,
      numeroPlazo: DatosParametro.plazo
    };

    const dialogRef =
      this.modalService.abrirModalDeudaIndirectaDirecta(_deudaEditando);

    dialogRef.afterClosed().subscribe((_deudaEditando) => {
      if (_deudaEditando) {
        this.valorDPI = _deudaEditando.cuotaPotencialIndirecta;
        this.borderColor = 'green';
        this.store.dispatch(
          FlujoCajaActions.updateDeudaIndirecta({ deudaindirecta: null })
        );
      }
    });
  }

  private calcularCuotaPotencialDirecta(): number {
    const VA = 1000; // valor ingresado
    const FC = this.DPD.factorConversion; // factor de conversión
    const i = this.DPD.tEM; // tasa efectiva mensual
    const n = this.DPD.plazo; // número de plazo
    const resultado = this.FormulaDedudaDirecta(VA, FC, i, n);
    return resultado;
  }

  FormulaDedudaDirecta(VA: number, FC: number, i: number, n: number): number {
    const numerador = VA * -FC * i;
    const denominador = 1 - Math.pow(1 + i, -n);
    const resultado = numerador / denominador;
    return resultado;
    //  return (VA * (-FC) * i) / (1 - Math.pow(1 + i, -n));
  }

  private calcularCuotaPotencialIndirecta(): number {
    const VA = 1000; // Valor ingresado
    const FCC = 0.07; // Factor de Conversión según calificación crediticia
    const i = 0.02; // Tasa efectiva mensual
    const n = 12; // Número de plazo
    const resultado = this.FormulaDeudaIndirecta(VA, FCC, i, n);
    return resultado;
  }
  FormulaDeudaIndirecta(VA: number, FCC: number, i: number, n: number): number {
    const numerador = VA * -FCC * i;
    const denominador = 1 - Math.pow(1 + i, -n);
    const resultado = numerador / denominador;
    return resultado;
    // return (VA * (-FCC) * i) / (1 - Math.pow(1 + i, -n));
  }
}
