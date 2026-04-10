import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { FlujoCaja, FlujoCajaDPI } from 'src/app/models/flujocaja.interface';
import { ParametroDPIModal } from 'src/app/models/parametroDPI.interface';
import { selectDeudaDPI } from 'src/app/redux/selectors/flujo-caja/deuda.dpi.selectors';
import { selectParametrosDPI } from 'src/app/redux/selectors/flujo-caja/parametros.selectors';
import * as FlujoCajaActionsDPI from 'src/app/redux/actions/flujo-caja/deuda.dpi.actions';
import { MatDialogRef } from '@angular/material/dialog';
import { selectFCData } from 'src/app/redux/selectors/flujo-caja/flujo.caja.selectors';
@Component({
  selector: 'app-modal-dpi',
  templateUrl: './modal-dpi.component.html',
  styleUrls: ['./modal-dpi.component.css']
})
export class ModalDpiComponent implements OnInit {

  parametrosDPI: ParametroDPIModal[];
  deudaDPI: FlujoCajaDPI[];
  cuotaPotencialIndirecta: number = 0;
  flujoCaja: FlujoCaja;
  hash = new Map<string, string>();



  listaClasificaciones: any[] = [
    { calificacion: 'Normal' },
    { calificacion: 'CPP' },
    { calificacion: 'Deficiente' },
    { calificacion: 'Dudoso' },
    { calificacion: 'Perdida' }
  ];

  constructor(private store: Store<AppState>
    , private dialogRef: MatDialogRef<ModalDpiComponent>,
    private cdref: ChangeDetectorRef ) { }

    
  ngOnInit(): void {
    this.hash.set('Normal', '1')
    this.hash.set('CPP', '2')
    this.hash.set('Deficiente', '3')
    this.hash.set('Dudoso', '4')
    this.hash.set('Perdida', '5')

    this.store.select(selectParametrosDPI).subscribe({
      next: data => { if (data) { 

        this.parametrosDPI = data.map(p => ({ ...p })); } 
        this.parametrosDPI.forEach((item) => { 
          item.valor = null 
        })
      }
    });
    this.store.select(selectDeudaDPI).subscribe({
      next: data => { if (data) { this.deudaDPI = data.map(p => ({ ...p })); } }
    });

    this.store.select(selectFCData).subscribe({
      next : data =>{
        this.flujoCaja = data.flujoCaja;
      }
    })
  }

  ngAfterViewInit(): void {
    // setTimeout(() => {

      this.deudaDPI.forEach((item) => { this.obtenerValorAnterior(item.idParametroDpi); });
      this.SumatoriaCuotaPotencialIndirecta();
      this.cdref.detectChanges();
    // }, 0);
  }

  obtenerValorAnterior(id: string) {
    let found_parametro = this.parametrosDPI.find(item => item.idParametroDPI.trim() == id.trim());
    let found_deuda = this.deudaDPI.find(item => item.idParametroDpi.trim() == id.trim());
    if (found_parametro && found_deuda) {
      found_parametro.valor = found_deuda.montoDeuda;
      found_parametro.calificacion = found_deuda.calificacion;
      found_parametro.factorConversion = found_parametro['factorCalificacion' + found_deuda.calificacion];
    }
    else found_parametro.valor = null;
  }

  onSelectChange(event: any, dpi: ParametroDPIModal) {
    dpi.factorConversion = dpi['factorCalificacion' + event.value];
    dpi.calificacion = event.value;
    this.SumatoriaCuotaPotencialIndirecta();
  }

  onModelChange() {
    this.SumatoriaCuotaPotencialIndirecta();
  }

  agregarDPI() {
    this.parametrosDPI.forEach((parametro: ParametroDPIModal) => {
      parametro.valor = parametro.valor ? parametro.valor : 0;
      let deuda: FlujoCajaDPI = { idParametroDpi: parametro.idParametroDPI, montoDeuda: parametro.valor, calificacion: parametro.calificacion }
     

      if(this.flujoCaja.deudaPI != null) {
        this.flujoCaja.deudaPI.forEach(e => {
          
          if(e.idParametroDpi.trim() == deuda.idParametroDpi.trim()){
            e.calificacion = this.hash.get(deuda.calificacion);
            e.montoDeuda = deuda.montoDeuda;
          }
        });
      }

      if (this.deudaDPI.some(d => d.idParametroDpi.trim() == parametro.idParametroDPI.trim())){
        this.store.dispatch(FlujoCajaActionsDPI.updateDeudaIndirecta({ deudaindirecta: deuda }));
      }
      else
      {
        this.store.dispatch(FlujoCajaActionsDPI.addDeudaIndirecta({ deudaindirecta: deuda }));
      }
    });
    this.SumatoriaCuotaPotencialIndirecta();
    this.dialogRef.close({ success: true, data: parseFloat(this.cuotaPotencialIndirecta.toFixed(2)) });
  }

  cerrarMdl() {
    this.dialogRef.close({ success: false, data: 0.00 });
  }

  SumatoriaCuotaPotencialIndirecta() {
    this.cuotaPotencialIndirecta = 0;
    this.parametrosDPI.forEach((item) => {
      item['valor'] = item['valor'] ?? null;
      item['factorConversion'] = item['factorConversion'] ?? 0;
      item['tem'] = item['tem'] ?? 0;
      item['plazo'] = item['plazo'] ?? 0;
      this.cuotaPotencialIndirecta = this.cuotaPotencialIndirecta +
        this.calcularCuotaPotencialIndirecta(item['valor'], item['factorConversion'], item['tem'], item['plazo']);
    });
  }

  /**
 * @param _VA * Valor ingresado
 * @param _FCC * Factor de conversión según calificación crediticia
 * @param _i * Tasa efectiva mensual
 * @param _n * número de plazo
 * @returns cuota potencial indirecta
 */
  private calcularCuotaPotencialIndirecta(_VA: number, _FCC: number, _i: number, _n: number)
    : number {
    const VA = _VA;
    const FCC = _FCC;
    const i = _i;
    const n = _n;
    const resultado = this.FormulaDeudaPotencialIndirecta(VA, FCC, i, n);
    return resultado;
  }

  FormulaDeudaPotencialIndirecta(VA: number, FCC: number, i: number, n: number): number {
    const numerador = VA * (-(FCC / 100)) * (i / 100);
    const denominador = 1 - Math.pow(1 + (i / 100), -n);
    const resultado = numerador / denominador;
    return resultado;
  }

}
