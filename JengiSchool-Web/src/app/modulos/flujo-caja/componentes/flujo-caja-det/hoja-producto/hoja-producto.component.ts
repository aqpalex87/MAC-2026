import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { FlujoCaja, FlujoCajaHP } from 'src/app/models/flujocaja.interface';
import { Solicitud } from 'src/app/models/solicitud.interface';
import { selectFlujoCajaHP } from 'src/app/redux/selectors/flujo-caja/hp.selectors';
import { selectSolicitud } from 'src/app/redux/selectors/flujo-caja/solicitud.selectors';
import * as FlujoCajaHPActions from 'src/app/redux/actions/flujo-caja/hp.actions';
import * as FlujoCajaActions from 'src/app/redux/actions/flujo-caja/flujo.caja.actions';
import { selectFlujoCaja } from 'src/app/redux/selectors/flujo-caja/flujo.caja.selectors';
import { selectIsEditableFC } from 'src/app/redux/selectors/shared/shared.selectors';
@Component({
  selector: 'app-hoja-producto',
  templateUrl: './hoja-producto.component.html',
  styleUrls: ['./hoja-producto.component.css']
})
export class HojaProductoComponent implements OnInit {

  solicitud: Solicitud;
  flujoCaja: FlujoCaja;
  flujoCajaHP: FlujoCajaHP[];
  enableEditHP: boolean = false;
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
        if (data) {
          this.solicitud = data;
          this.enableEditHP = (data.codHP < 0 || data.codHP == null);
        }
      },
    });

    this.store.select(selectFlujoCaja).subscribe({
      next: data => {
        if (data) {
          this.flujoCaja = data;
        }
      },
    });

    this.store.select(selectFlujoCajaHP).subscribe({
      next: data => {
        if (data) {
          this.flujoCajaHP = data;
        }
      },
    });
  }

  onModelChange(hp: FlujoCajaHP) {
    switch (hp.codItem) {
      case "HPCOST":
        this.solicitud.hpCosto = hp.monto;
        this.flujoCaja.hpCosto = hp.monto;
        break;
      case "HPPREC":
        this.solicitud.hpPrecio = hp.monto;
        this.flujoCaja.hpPrecio = hp.monto;
        break;
      case "HPREND":
        this.solicitud.hpRendimiento = hp.monto;
        this.flujoCaja.hpRendimiento = hp.monto;
        break;
    }

    this.store.dispatch(FlujoCajaActions.setSolicitud({ solicitud: this.solicitud }));
    this.store.dispatch(FlujoCajaActions.setFlujoCaja({ flujocaja : this.flujoCaja }));
    this.store.dispatch(FlujoCajaHPActions.editarItem({ hp: hp }));
  }
}
