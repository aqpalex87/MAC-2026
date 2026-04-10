import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { FlujoCaja, FlujoCajaOC } from 'src/app/models/flujocaja.interface';
import { selectOC } from 'src/app/redux/selectors/flujo-caja/flujo.caja.selectors';
import * as FlujoCajaOCActions from 'src/app/redux/actions/flujo-caja/oc.actions';
import { selectIsEditableFC } from 'src/app/redux/selectors/shared/shared.selectors';
import { OtrosCargosConstants } from 'src/app/shared/common/otrosCargos.constants';
import { selectSolicitud } from 'src/app/redux/selectors/flujo-caja/solicitud.selectors';
import { Solicitud } from 'src/app/models/solicitud.interface';
import { selectOtrosCargos } from 'src/app/redux/selectors/flujo-caja/oc.selectors';

@Component({
  selector: 'app-otros-cargos',
  templateUrl: './otros-cargos.component.html',
  styleUrls: ['./otros-cargos.component.css']
})
export class OtrosCargosComponent implements OnInit {
  oc: FlujoCajaOC[];
  flujoCaja: FlujoCaja;

  solicitud: Solicitud;
  selected: string[] = []
  montoEstimadoFinanciar: number = 0;
  isEditableFC: boolean = false;


  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.store.select(selectIsEditableFC).subscribe({
      next: data => {
        if (data) { this.isEditableFC = data; }
      }
    });
    this.store.select(selectSolicitud).subscribe({
      next: data => {
        this.solicitud = data;
      },
    });
    this.store.select(selectOtrosCargos).subscribe(data => {
      if (data && data.length > 0) {
        this.oc = data.map(p => ({ ...p }));
        this.calcularSumatoriaOC();
      }
    });
  }

  verificarTasa(i: FlujoCajaOC): boolean {
    if (i.codItem === OtrosCargosConstants.AsistenciaTecnica) {
      return false;
    } else {
      return i.tasa == 0;
    }
  }

  obtenerItemDesgravamen(): FlujoCajaOC {
    let item = this.oc.find(item => item.codItem === OtrosCargosConstants.Desgravamen);
    return item;
  }

  calcularMonto(oc: FlujoCajaOC) {
    switch (oc.codItem) {
      case OtrosCargosConstants.SeguroAgricola:
        if (!this.selected.find(item => item === oc.codItem)) {
          oc.monto = 0;
        } else {
          oc.monto = this.calcularSeguroAgricola(this.solicitud.hpCosto, oc.tasa);
        }
        if (this.selected.find(item => item === OtrosCargosConstants.Desgravamen)) {
          this.calcularMonto(this.obtenerItemDesgravamen());
        }
        break;
      case OtrosCargosConstants.AsistenciaTecnica:
        if (!this.selected.find(item => item === oc.codItem)) {
          oc.monto = null;
        } else {
        }
        if (this.selected.find(item => item === OtrosCargosConstants.Desgravamen)) {
          this.calcularMonto(this.obtenerItemDesgravamen());
        }
        break;
      case OtrosCargosConstants.Desgravamen:
        if (!this.selected.find(item => item === oc.codItem)) {
          oc.monto = 0;
        } else {
          let montoSolicitado = this.solicitud.montoSolicitado;
          let montoSeguroAgricola = this.obtenerMontoCargo(OtrosCargosConstants.SeguroAgricola);
          let montoAsistenciaTecnica = this.obtenerMontoCargo(OtrosCargosConstants.AsistenciaTecnica);
          oc.monto = this.calcularMontoDesgravamen(montoSolicitado, montoSeguroAgricola, montoAsistenciaTecnica, oc.tasa);
        }
        break;
    }

    this.store.dispatch(FlujoCajaOCActions.editarItem({ oc: oc }));

    this.calcularSumatoriaOC();
  }

  calcularSumatoriaOC() {
    let sumatoriaOC = this.oc.reduce((acc, item) => { return acc + item.monto }, 0);
    this.montoEstimadoFinanciar = sumatoriaOC + this.solicitud.montoSolicitado;
  }

  obtenerMontoCargo(codItem: string) {
    let item = this.oc.find(item => item.codItem === codItem);
    if (item) {
      return item.monto;
    } else {
      return 0;
    }
  }

  onModelChange(o: FlujoCajaOC) {
    this.calcularMonto(o);
    //this.store.dispatch(FlujoCajaOCActions.editarItem({ oc: o }));
  }

  /**
   * @param _MS * Monto Solicitado
   * @param _MSA * Monto Seguro Agrícola
   * @param _MAT * Monto Asistencia Técnica
   * @param _td * Tasa desgravamen
   * @returns 
   */
  private calcularMontoDesgravamen(_MS: number, _MSA: number, _MAT: number, _td: number)
    : number {
    const MS = _MS;
    const MSA = _MSA;
    const MAT = _MAT;
    const td = _td;
    const montoDesgravamen = this.FormulaMontoDesgravamen(MS, MSA, MAT, td);
    return montoDesgravamen;
  }

  FormulaMontoDesgravamen(MS: number, MSA: number, MAT: number, td: number): number {
    return (MS + MSA + MAT) * td / 100;
  }

  /**
   * @param _C * Costo del HP
   * @param _t * Tasa del seguro agrícola
   * @returns Monto seguro agrícola
   */
  private calcularSeguroAgricola(_C: number, _t: number)
    : number {
    const C = _C;
    const t = _t;
    const montoSeguroAgricola = this.FormulaMontoSeguroAgricola(C, t);
    return montoSeguroAgricola;
  }

  FormulaMontoSeguroAgricola(C: number, t: number): number {
    return C * (t / 100.0);
  }

}