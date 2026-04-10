import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { FlujoCaja, FlujoCajaDPD } from 'src/app/models/flujocaja.interface';
import { ParametroDPDModal } from 'src/app/models/parametroDPD.interface';
import { selectDeudaDPD } from 'src/app/redux/selectors/flujo-caja/deuda.dpd.selectors';
import { selectParametrosDPD } from 'src/app/redux/selectors/flujo-caja/parametros.selectors';
import * as FlujoCajaActionsDPD from 'src/app/redux/actions/flujo-caja/deuda.dpd.actions';
import { MatDialogRef } from '@angular/material/dialog';
import { selectFCData } from 'src/app/redux/selectors/flujo-caja/flujo.caja.selectors';

@Component({
  selector: 'app-modal-dpd',
  templateUrl: './modal-dpd.component.html',
  styleUrls: ['./modal-dpd.component.css']
})
export class ModalDpdComponent implements OnInit {

  parametrosDPD: ParametroDPDModal[];
  deudaDPD: FlujoCajaDPD[];
  cuotaPotencialDirecta: number | null = null;
  flujoCaja: FlujoCaja;

  constructor(private store: Store<AppState>
    , private dialogRef: MatDialogRef<ModalDpdComponent>) { }

  ngOnInit(): void {
    this.store.select(selectParametrosDPD).subscribe({
      next: data => {
        if (data) {
          this.parametrosDPD = data.map(p => ({ ...p }));
          this.parametrosDPD.forEach((item) => { 
            item.valor = null 
          })
        }
      }
    });
    this.store.select(selectDeudaDPD).subscribe({
      next: data => { 
        if (data) { this.deudaDPD = data.map(p => ({ ...p })); } 
      }
    });
    this.store.select(selectFCData).subscribe({
      next : data =>{
        this.flujoCaja = data.flujoCaja;
      }
    })
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.deudaDPD.forEach((item) => { this.obtenerValorAnterior(item.idParametroDpd); });
      this.SumatoriaCuotaPotencialDirecta();
    }, 0);
  }

  obtenerValorAnterior(id: string) {
    let found_parametro = this.parametrosDPD.find(item => item.idParametroDPD.trim() == id.trim());
    let found_deuda = this.deudaDPD.find(item => item.idParametroDpd.trim() == id.trim());
    if (found_parametro && found_deuda) { found_parametro.valor = found_deuda.montoDeuda; }
    else found_parametro.valor = null;
  }

  onModelChange() { this.SumatoriaCuotaPotencialDirecta(); }

  agregarDPD() {
    this.parametrosDPD.forEach((parametro: ParametroDPDModal) => {
      parametro.valor = parametro.valor ? parametro.valor : 0;
      let deuda: FlujoCajaDPD = { idParametroDpd: parametro.idParametroDPD.trim(), montoDeuda: parametro.valor }
      if(this.flujoCaja.deudaPD != null) {
        this.flujoCaja.deudaPD.forEach(e => {
    
          if(e.idParametroDpd.trim() == deuda.idParametroDpd.trim()){
            e.montoDeuda = deuda.montoDeuda;
          }
        });
      }
      if (this.deudaDPD.some(d => d.idParametroDpd.trim() == parametro.idParametroDPD.trim()))
        this.store.dispatch(FlujoCajaActionsDPD.updateDeudaDirecta({ deudadirecta: deuda }));
      else
        this.store.dispatch(FlujoCajaActionsDPD.addDeudaDirecta({ deudadirecta: deuda }));
    });
    this.dialogRef.close({ success: true, data: parseFloat(this.cuotaPotencialDirecta.toFixed(2)) });
  }

  cerrarMdl() {
    this.dialogRef.close({ success: false, data: 0.00 });
  }

  SumatoriaCuotaPotencialDirecta() {
    this.cuotaPotencialDirecta = 0;
    this.parametrosDPD.forEach((item) => {
      item['valor'] = item['valor'] ?? null;
      item['factorConversion'] = item['factorConversion'] ?? 0;
      item['tem'] = item['tem'] ?? 0;
      item['plazo'] = item['plazo'] ?? 0;
      this.cuotaPotencialDirecta = this.cuotaPotencialDirecta +
        this.calcularCuotaPotencialDirecta(item['valor'], item['factorConversion'], item['tem'], item['plazo']);
    });
  }

  /**
   * @param _VA * Valor ingresado
   * @param _FC * Factor de Conversión
   * @param _i * Tasa efectiva mensual
   * @param _n * número de plazo
   * @returns cuota potencial directa
   */
  private calcularCuotaPotencialDirecta(_VA: number, _FC: number, _i: number, _n: number)
    : number {
    const VA = _VA;
    const FC = _FC;
    const i = _i;
    const n = _n;
    const resultado = this.FormulaDeudaPotencialDirecta(VA, FC, i, n);
    return resultado;
  }

  FormulaDeudaPotencialDirecta(VA: number, FC: number, i: number, n: number): number {
    const numerador = VA * (-(FC / 100)) * (i / 100);
    const denominador = 1 - Math.pow(1 + (i / 100), -n);
    const resultado = numerador / denominador;
    return resultado;
  }
}
