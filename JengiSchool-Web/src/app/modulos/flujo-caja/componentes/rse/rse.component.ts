import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { FlujoCaja, FlujoCajaRatio, Rse } from 'src/app/models/flujocaja.interface';
import * as SharedActions from 'src/app/redux/actions/shared/shared.actions';
import { selectTabRSE } from 'src/app/redux/selectors/flujo-caja/rse.selectors';
import * as FlujoCajaRSEActions from 'src/app/redux/actions/flujo-caja/rse.actions';
import { selectIsEditableFC } from 'src/app/redux/selectors/shared/shared.selectors';
import { selectFCD_ESFA, selectFlujoCaja } from 'src/app/redux/selectors/flujo-caja/flujo.caja.selectors';
import * as ComentariosActions from 'src/app/redux/actions/flujo-caja/comentarios.actions';
import { selectComentarioRSE } from 'src/app/redux/selectors/flujo-caja/comentarios.selectors';
import { selectRatios } from 'src/app/redux/selectors/flujo-caja/ratios.selectors';
import { selectTablaFCDetalle } from 'src/app/redux/selectors/flujo-caja/fcdetalle.selectors';
import { FlujoCajaDetalle } from 'src/app/models/FlujoCajaDetalle.interface';
import { FlujoCajaESFA } from 'src/app/models/flujoCajaESFA.interface';
import { SharedRSEService } from 'src/app/services/shared/shared.rse.service';
import { Solicitud } from 'src/app/models/solicitud.interface';
import { selectSolicitud } from 'src/app/redux/selectors/flujo-caja/solicitud.selectors';
import { selectParametrosComportamiento, selectParametrosRSECondiciones, selectParametrosTipoCliente } from 'src/app/redux/selectors/flujo-caja/parametros.selectors';
import { ParametroComportamiento } from 'src/app/models/parametroComportamiento.interface';
import { ParametroRSECondicion } from 'src/app/models/parametroRSECondicion.interface';
import { ParametroTipoCliente } from 'src/app/models/parametroTipoCliente.interface';

@Component({
  selector: 'app-rse',
  templateUrl: './rse.component.html',
  styleUrls: ['./rse.component.css']
})
export class RseComponent implements OnInit {

  listComportamiento: any[] = ['OK', 'NO'];
  esfa: FlujoCajaESFA[] = [];
  flujoCaja: FlujoCaja;
  flujoCajaDetalle: FlujoCajaDetalle[] = [];
  rse: Rse;
  resultadoCriterio1: string = '';
  resultadoCriterio2: string = '';
  VALOR_PORCENTUAL = 70;
  NUMERO_MESES = 36;
  NUMERO_CREDITOS = 1;
  isEditableFC: boolean = false;
  comentarioRse: string = '';
  ratios: FlujoCajaRatio[] = [];
  solicitud: Solicitud;
  parametrosTipoClientes: ParametroTipoCliente[];
  comportamiento: ParametroComportamiento[]
  tipoCliente: string;
  rseCondiciones: ParametroRSECondicion[]

  parametroSobreendeudamiento: number = 0;

  constructor(private store: Store<AppState>
    , private rseSvc: SharedRSEService) { }

  ngOnInit(): void {
    this.store.select(selectIsEditableFC).subscribe({
      next: data => {
        if (data) { this.isEditableFC = data; }
      }
    });
    this.store.select(selectTabRSE).subscribe({
      next: data => {
        if (data) {
          this.rse = data;
          this.isCompletedRSE();
        }
      }
    });

    this.store.select(selectSolicitud).subscribe({
      next: data => {
        if (data) {
          this.solicitud = data;
          if (this.rse.tipoCliente || this.rse.tipoCliente == null || this.rse.tipoCliente == '')
            this.rse.tipoCliente = this.solicitud.tipoCliente;
        }
      }
    });

    this.store.select(selectParametrosTipoCliente).subscribe({
      next: data => {
        if (data) {
          this.parametrosTipoClientes = data;
        }
      }
    });

    this.store.select(selectFlujoCaja).subscribe({
      next: data => {
        if (data) { this.flujoCaja = data; }
      }
    });
    this.store.select(selectTablaFCDetalle).subscribe({
      next: data => {
        if (data) {
          //this.rseSvc.calcularRSE();
          this.flujoCajaDetalle = data;
        }
      }
    });

    this.store.select(selectParametrosRSECondiciones).subscribe({
      next: data => {
        this.rseCondiciones = data;
      }
    });

    this.store.select(selectFCD_ESFA).subscribe({
      next: data => {
        if (data) {
          this.esfa = data;
          this.rseSvc.setData(this.rse, this.flujoCaja, this.flujoCajaDetalle, this.esfa, this.solicitud);
          let rse = this.rseSvc.calcularRSE();

          this.store.dispatch(FlujoCajaRSEActions.setRSE({ rse }));
          this.analizarCriterios();
        }
      }
    });
    this.store.select(selectRatios).subscribe({
      next: data => {
        if (data) {
          console.log(data)
          this.ratios = [...data];
          const sobreendeudamiento = this.ratios.find(ratio => ratio.idParametroRatio === 1);
          if (sobreendeudamiento) {
            this.parametroSobreendeudamiento = sobreendeudamiento.valorParametro;
            this.analizarCriterios();
          }
        }
      }
    });
    this.store.select(selectComentarioRSE).subscribe({
      next: data => {
        this.comentarioRse = data;
      }
    });

    this.store.select(selectParametrosComportamiento).subscribe({
      next: data => {
        this.comportamiento = data;
      }
    });
  }

  isCompletedRSE() {
    let completed: boolean = true;
    if (this.rse.comportamiento.trim() != '') {
      console.log("entro aqui")
      this.store.dispatch(SharedActions.isCompletedRSE({ isCompleted: true }));
    } else {
      this.store.dispatch(SharedActions.isCompletedRSE({ isCompleted: false }));
    }
  }

  analizarCriterios() {
    this.analizarCriterio1(this.rse.nroEntidades);
    this.analizarCriterio2(this.rse.ratioCP);
    this.analizarResultado();
    this.isCompletedRSE();
  }

  analizarCriterio1(nroEntidades: number) {
    if (this.parametrosTipoClientes) {
      console.log("parametrosTipoClientes: ",this.parametrosTipoClientes)
      let parametro: ParametroTipoCliente = this.parametrosTipoClientes.find(item => item.idParametroTipoCliente === 3);
      if (parametro) {
        let numEntidadesParam: number = parametro.valorParametro
        if (nroEntidades && numEntidadesParam) {
          if (nroEntidades <= numEntidadesParam)
            this.resultadoCriterio1 = 'OK';
          if (nroEntidades > numEntidadesParam)
            this.resultadoCriterio1 = 'NO';
        } else
          this.resultadoCriterio1 = 'OK';
      }
    }
  }

  analizarCriterio2(ratioCP: number) {
    console.log(ratioCP)
    if (this.parametroSobreendeudamiento > 0) {
      if (ratioCP <= this.parametroSobreendeudamiento / 100)
        this.resultadoCriterio2 = 'OK';
      if (ratioCP > this.parametroSobreendeudamiento / 100)
        this.resultadoCriterio2 = 'NO';
    } else
      this.resultadoCriterio2 = 'NO';

  }

  analizarResultado() {

    let criterio1 = this.resultadoCriterio1 ?? '';
    let criterio2 = this.resultadoCriterio2 ?? '';
    let criterio3 = this.rse.comportamiento ?? '';

    this.rse.resultado = '';
    this.rse.condicion = '';

    if (this.rseCondiciones) {
      this.rseCondiciones.forEach(condicion => {
        if (condicion.criterio01 === criterio1 && condicion.criterio02 === criterio2 && condicion.criterio03 === criterio3) {
          this.rse.resultado = condicion.resultado;
          this.rse.condicion = condicion.condicion;
        }
      });
    }

    this.rseSvc.setDataRSE(this.rse)
    this.store.dispatch(FlujoCajaRSEActions.setRSE({ rse: this.rse }));
    this.isCompletedRSE();

  }

  onModelChangeComentario(): void {
    this.store.dispatch(ComentariosActions.setComentarioRSE({ comentarioRse: this.comentarioRse }));
  }

  onModelChangeNroEntidades(nroEntidades: number) {
    this.analizarCriterio1(nroEntidades);
  }

  onModelChangeRatioCP(ratio: number) {
    this.analizarCriterio2(ratio);
  }

  onModelChangeCriterio2() {
    let tca = this.rse.totCuotasCredito ?? 0;
    let tcsf = this.rse.totCuotasDD ?? 0;
    let tdp = this.rse.totDeudaPotenciales ?? 0;
    let texd = this.rse.totExcedentes ?? 0;
    let ratioCP = this.calcularRatioCP(tca, tcsf, tdp, texd);
    this.rse.ratioCP = ratioCP;
    // this.rse.ratioCP = Math.floor(ratioCP * 100) / 100;

  }

  /**
   * @param _TCA Total cuotas de la propuesta de crédito
   * @param _TCSF Total de cuotas deudas directas en entidades financieras
   * @param _TDP Total de deudas potenciales
   * @param _TEXD Total de excedentes antes del pago del IFIS
   * @returns RatioCP
   */
  private calcularRatioCP(_TCA: number, _TCSF: number, _TDP: number, _TEXD: number)
    : number {
    const TCA = _TCA;
    const TCSF = _TCSF;
    const TDP = _TDP;
    const TEXD = _TEXD;
    const resultado = this.FormulaRatioCP(TCA, TCSF, TDP, TEXD);
    return resultado;
  }

  FormulaRatioCP(TCA: number, TCSF: number, TDP: number, TEXD: number): number {
    const numerador = TCA + TCSF + TDP;
    const denominador = TEXD;
    if (denominador == 0) return 0;
    const resultado = numerador / denominador;
    return resultado;
  }

}
