import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { FlujoCajaPDR } from 'src/app/models/flujocaja.interface';
import * as PDRActions from 'src/app/redux/actions/flujo-caja/pdr.actions';
import { selectPdr } from 'src/app/redux/selectors/flujo-caja/pdr.selectors';
import { MessageService } from 'primeng/api';
import { selectIsEditableFC } from 'src/app/redux/selectors/shared/shared.selectors';
import { Solicitud } from 'src/app/models/solicitud.interface';
import { selectSolicitud } from 'src/app/redux/selectors/flujo-caja/solicitud.selectors';

@Component({
  selector: 'app-pdr',
  templateUrl: './pdr.component.html',
  styleUrls: ['./pdr.component.css'],
  providers: [MessageService]
})
export class PdrComponent implements OnInit {
  mesDesembolso: number = 0
  solicitud: Solicitud;
  pdr: FlujoCajaPDR[] = []
  readonly MAXIMO_ITEMS = 4;
  isEditableFC: boolean = false;

  constructor(private store: Store<AppState>, private messageSvc: MessageService) { }

  ngOnInit(): void {
    this.store.select(selectPdr).subscribe(data => {
      if (data && data.length > 0) {
        this.pdr = data.map(p => ({ ...p }));
      }
    });
    this.store.select(selectIsEditableFC).subscribe({
      next: data => {
        if (data) { this.isEditableFC = data; }
      }
    });
    this.store.select(selectSolicitud).subscribe({
      next: data => {
        if (data) { this.solicitud = data };
      }
    });

    this.mesDesembolso = this.solicitud.plazo;
  }

  onModelChange(pdr: FlujoCajaPDR) {
    if (!this.validSumPercents100()) { return; }
    this.store.dispatch(PDRActions.editarItem({ pdr }));
  }


  validSumPercents100(): boolean {
    const MAXIMO_PORCENTAJE = 100;
    let suma = 0;
    this.pdr.forEach(item => {
      suma += item.porcentaje;
    });
    if (suma > MAXIMO_PORCENTAJE) {
      this.messageSvc.clear();
      this.messageSvc.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'La sumatoria de la columna % desembolso debe ser 100%.',
        life: 5000
      });
      return false;
    }

    let mesValido = true;
    this.pdr.forEach(item => {
      if (item.mes > this.solicitud.plazo) { mesValido = false }
    });
    if (!mesValido) {
      this.messageSvc.clear();
      this.messageSvc.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'El mes de desembolso no debe ser mayor al plazo del credito',
        life: 5000
      });
      return false;
    }

    return true;
  }

  onClickAddItem() {
    if (!this.validSumPercents100()) { return; }

    const MAXIMO_ITEMS = 4;
    if (this.pdr.length == MAXIMO_ITEMS) {
      this.messageSvc.clear();
      this.messageSvc.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'El plan de desembolso debe ser entre 1 y 4 como maximo.',
        life: 5000
      });
      return;
    }

    let numero = this.pdr.length == 0 ? 1 : Math.max(...this.pdr.map(x => x.numero)) + 1;
    const pdr: FlujoCajaPDR = { numero, mes: null, porcentaje: null };
    this.store.dispatch(PDRActions.addItem({ pdr }));
  }

  deleteItem({ numero }) {
    this.store.dispatch(PDRActions.eliminarItem({ numero }));
  }
}
