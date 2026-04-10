import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { selectIsEditableFC } from 'src/app/redux/selectors/shared/shared.selectors';
import { selectSensibilizaciones } from 'src/app/redux/selectors/flujo-caja/sensibilizaciones.selectors';
import { Sensibilizaciones } from 'src/app/models/shared.interface';
import * as SensibilizacionesActions from '../../../../../redux/actions/flujo-caja/sensibilizaciones.actions';
import * as FlujoCajaActions from '../../../../../redux/actions/flujo-caja/flujo.caja.actions';
import { selectFlujoCaja } from 'src/app/redux/selectors/flujo-caja/flujo.caja.selectors';
import { FlujoCaja } from 'src/app/models/flujocaja.interface';

@Component({
  selector: 'app-sensibilizaciones',
  templateUrl: './sensibilizaciones.component.html',
  styleUrls: ['./sensibilizaciones.component.css']
})
export class SensibilizacionesComponent implements OnInit {

  sensibilizaciones: Sensibilizaciones;
  flujoCaja: FlujoCaja;
  isEditableFC: boolean = false;

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.store.select(selectSensibilizaciones).subscribe({
      next: data => { 
        this.sensibilizaciones = data;
      },
      error: err => { console.log('[Sensibilizaciones] A ocurrido un error'); }
    })

    this.store.select(selectFlujoCaja).subscribe({
      next: data => { this.flujoCaja = data },
      error: err => { console.log('[Sensibilizaciones] A ocurrido un error'); }
    })

    this.store.select(selectIsEditableFC).subscribe({
      next: data => {
        if (data) { this.isEditableFC = data; }
      }
    });
  }

  onModelChangeSvPrecio() {
    this.flujoCaja.svPrecio = this.sensibilizaciones.svPrecio;
    this.store.dispatch(FlujoCajaActions.setFlujoCaja({ flujocaja: this.flujoCaja }));
    this.store.dispatch(SensibilizacionesActions.setSensibilizacionesSvPrecio({ svPrecio: this.sensibilizaciones.svPrecio }));
  }

  onModelChangePrecioPromedio() {
    this.flujoCaja.precioPromedio = this.sensibilizaciones.precioPromedio;
    this.store.dispatch(FlujoCajaActions.setFlujoCaja({ flujocaja: this.flujoCaja }));
    this.store.dispatch(SensibilizacionesActions.setSensibilizacionesPrecioPromedio({ precioPromedio: this.sensibilizaciones.precioPromedio }));
  }

  onModelChangeRendimientoPromedio() {
    this.flujoCaja.rendimientoPromedio = this.sensibilizaciones.rendimientoPromedio;
    this.store.dispatch(FlujoCajaActions.setFlujoCaja({ flujocaja: this.flujoCaja }));
    this.store.dispatch(SensibilizacionesActions.setSensibilizacionesRendimientoPromedio({ rendimientoPromedio: this.sensibilizaciones.rendimientoPromedio }));
  }

  onModelChangeSvCosto() {
    this.flujoCaja.svCosto = this.sensibilizaciones.svCosto;
    this.store.dispatch(FlujoCajaActions.setFlujoCaja({ flujocaja: this.flujoCaja }));
    this.store.dispatch(SensibilizacionesActions.setSensibilizacionesSvCosto({ svCosto: this.sensibilizaciones.svCosto }));
  }

  onModelChangeSvRendimiento() {
    this.flujoCaja.svRendimiento = this.sensibilizaciones.svRendimiento;
    this.store.dispatch(FlujoCajaActions.setFlujoCaja({ flujocaja: this.flujoCaja }));
    this.store.dispatch(SensibilizacionesActions.setSensibilizacionesSvRendimiento({ svRendimiento: this.sensibilizaciones.svRendimiento }));
  }

}
