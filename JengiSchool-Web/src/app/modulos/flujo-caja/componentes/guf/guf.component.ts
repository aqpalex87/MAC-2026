import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { FlujoCajaGUF } from 'src/app/models/FlujoCajaGUF.interface';
import { FlujoCaja } from 'src/app/models/flujocaja.interface';
import { GlobalConstants } from 'src/app/shared/common/globalContants';
import * as SharedActions from 'src/app/redux/actions/shared/shared.actions';
import { SharedFlujoCajaService } from 'src/app/services/shared/shared.flujoCaja.service';
import { selectTablaGUF } from 'src/app/redux/selectors/flujo-caja/guf.selectors';
import { selectFlujoCaja } from 'src/app/redux/selectors/flujo-caja/flujo.caja.selectors';
import * as FlujoCajaGUFActions from 'src/app/redux/actions/flujo-caja/guf.actions';
import { selectIsEditableFC } from 'src/app/redux/selectors/shared/shared.selectors';
import { selectComentarioGUF } from 'src/app/redux/selectors/flujo-caja/comentarios.selectors';
import * as ComentariosActions from 'src/app/redux/actions/flujo-caja/comentarios.actions';
import { SharedFCDetalleService } from 'src/app/services/shared/shared.fcdetalle.service';
import { SharedESFAService } from 'src/app/services/shared/shared.guf.service';

@Component({
  selector: 'app-guf',
  templateUrl: './guf.component.html',
  styleUrls: ['./guf.component.css'],
})
export class GufComponent implements OnInit {

  data: FlujoCajaGUF[] = [];
  comentarioGuf: string = "";
  mesActual: string = "";
  mesFlujoCaja: string = "";
  totalActual: number = 0;
  totalFlujoCaja: number = 0;
  idCanastaBasica: number = GlobalConstants.idCanastaBasicaGUF;
  flujoCaja: FlujoCaja;
  isEditableFC: boolean = true;

  mesDesembolsoAnterior: string = "";
  fcAnterior: any;

  constructor(private store: Store<AppState>
    , private sharedFCSvc: SharedFlujoCajaService
    , private gufSvc: SharedESFAService
    ) { }

  ngOnInit(): void {
    this.store.select(selectIsEditableFC).subscribe({
      next: data => { this.isEditableFC = data; }
    });
    this.store.select(selectFlujoCaja).subscribe({
      next: data => this.flujoCaja = data
    });
    this.store.select(selectTablaGUF).subscribe({
      next: data => {
        this.data = data.map(item => ({ ...item }));
        if (data && data.length > 0) {
          this.calcularGUF(this.data);
        }
      }
    });
    this.mesActual = this.sharedFCSvc.obtenerMesAnioActual();
    this.fcAnterior = this.gufSvc.getDesembolsoAnterior();
    this.store.select(selectComentarioGUF).subscribe({
      next: data => {
        this.comentarioGuf = data;
      }
    });

    if(this.fcAnterior && this.fcAnterior.periodoFC > 0){
      this.mesDesembolsoAnterior = this.sharedFCSvc.obtenerMesAnioByPeriodo(this.fcAnterior.periodoFC);
    }else {
      this.mesDesembolsoAnterior = '-'
    }
  }

  calcularGUF(data: FlujoCajaGUF[]) {
    let sumaTotal = 0;
    let sumaTotalMontoAnterior= 0;
    if (data && data.length > 0) {
      sumaTotal = -(this.data
        .filter((item: FlujoCajaGUF) => item.idParametroGasto != -1)
        .reduce((sum: number, current: FlujoCajaGUF) => (+sum + +current.montoActual), 0));

      sumaTotalMontoAnterior = -(this.data
        .filter((item: FlujoCajaGUF) => item.idParametroGasto != -1)
        .reduce((sum: number, current: FlujoCajaGUF) => (+sum + +current.montoAnterior), 0));
    }
    this.totalActual = sumaTotal;
    this.totalFlujoCaja = sumaTotalMontoAnterior;
    this.checkCompletedGUF(sumaTotal);
    this.setMontoGUF(sumaTotal);
  }

  onModelChange(): void {
    let sumaTotal = 0;
    let sumaTotalMontoAnterior= 0;
    if (this.data && this.data.length > 0) {
      sumaTotal = this.data
        .filter((item: FlujoCajaGUF) => item.idParametroGasto != -1)
        .reduce((sum: number, current: FlujoCajaGUF) => (+sum + +current.montoActual), 0);
      this.store.dispatch(FlujoCajaGUFActions.setTablaGuf({ items: this.data }));

      sumaTotalMontoAnterior = this.data
        .filter((item: FlujoCajaGUF) => item.idParametroGasto != -1)
        .reduce((sum: number, current: FlujoCajaGUF) => (+sum + +current.montoAnterior), 0);
      this.store.dispatch(FlujoCajaGUFActions.setTablaGuf({ items: this.data }));
    }
    this.totalActual = -Math.abs(sumaTotal);
    this.totalFlujoCaja = -Math.abs(sumaTotalMontoAnterior);
    this.checkCompletedGUF(sumaTotal);
    this.setMontoGUF(sumaTotal);
  }

  onModelChangeComentario(): void {
    this.store.dispatch(ComentariosActions.setComentarioGUF({ comentarioGuf: this.comentarioGuf }));
  }

  setMontoGUF(sumaTotal: number) {
    this.store.dispatch(SharedActions.setMontoGUF({ monto: sumaTotal}));
  }

  checkCompletedGUF(sumaTotal: number) {
    let isCompleted = false;
    if (sumaTotal != 0)
      isCompleted = true;
    this.store.dispatch(SharedActions.isCompletedGUF({ isCompleted }));
  }

  clearInput(id) {
    //this.userForm.get('fullName')?.reset();
    this.data[id].montoActual = null;
  }
}
