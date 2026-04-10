import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { FlujoCajaItemConstants } from 'src/app/shared/common/flujoCajaItemConstants';
import { FlujoCaja } from 'src/app/models/flujocaja.interface';
import { selectIsEditableFC } from 'src/app/redux/selectors/shared/shared.selectors';
import { Solicitud } from 'src/app/models/solicitud.interface';
import { ERAConstants } from 'src/app/shared/common/era.constants';
import { SharedService } from 'src/app/services/shared/shared.service';
import { SharedERAService } from 'src/app/services/shared/shared.era.service';
import { selectTabERA } from 'src/app/redux/selectors/flujo-caja/era.selectors';
import { selectSolicitud } from 'src/app/redux/selectors/flujo-caja/solicitud.selectors';
import * as FlujoCajaERAActions from 'src/app/redux/actions/flujo-caja/era.actions';
import * as ComentariosActions from 'src/app/redux/actions/flujo-caja/comentarios.actions';
import { selectComentarioERA } from 'src/app/redux/selectors/flujo-caja/comentarios.selectors';
import { SharedFlujoCajaService } from 'src/app/services/shared/shared.flujoCaja.service';

@Component({
  selector: 'app-era',
  templateUrl: './era.component.html',
  styleUrls: ['./era.component.css']
})
export class EraComponent implements OnInit {

  data: any[] = [];
  fc: FlujoCaja;
  solicitud: Solicitud;
  isEditableFC: boolean = false;
  mesActual: string = '';
  comentarioEra: string = '';
  fcAnterior: any;
  mesDesembolsoAnterior: string;

  readonly MONTO_ACTUAL = "DETALLE";
  readonly MONTO_ANTERIOR = "DETALLE";

  constructor(private store: Store<AppState>
    , private sharedSvc: SharedService
    , private eraSvc: SharedERAService
    , private sharedFCSvc: SharedFlujoCajaService) { }

  isNaNValue(value: any) {
    return isNaN(value);
  }

  ngOnInit(): void {

    this.fcAnterior = this.eraSvc.getDesembolsoAnterior();
    this.store.select(selectIsEditableFC).subscribe({
      next: data => { this.isEditableFC = data; }
    });
    this.mesActual = this.obtenerMesAnioActual();


    this.store.select(selectSolicitud).subscribe({
      next: data => { this.solicitud = data; }
    });
    this.store.select(selectTabERA).subscribe({
      next: data => {
        if (data.era && data.era.length > 0) {
          data.era = this.sharedSvc.expandir(data.era);
          this.data = data.era.map(item => ({ ...item }));
          //this.setMontoGUF(data.montoGUF);
        }
      }
    });
    this.store.select(selectComentarioERA).subscribe({
      next: data => {
        this.comentarioEra = data;
      }
    });

    if( this.fcAnterior != undefined){
      if(this.fcAnterior.periodoFC != 0){
        this.mesDesembolsoAnterior = this.sharedFCSvc.obtenerMesAnioByPeriodo(this.fcAnterior.periodoFC);
      }else {
        this.mesDesembolsoAnterior = '-'
      }
    }

  }

  setMontoGUF(montoGUF: number) {
    if (this.data && this.data.length > 0) {
      let GUF = this.eraSvc.obtenerNodoHijo(ERAConstants.UtilidadNeta, ERAConstants.UtilidadNeta_GastosFamiliares);
      if (GUF) { GUF.data.montoActual = montoGUF ?? 0; }
      let era = this.eraSvc.calcularDatosEra();
      this.data = this.sharedSvc.expandir(this.data);
      this.store.dispatch(FlujoCajaERAActions.setTablaEra({ items: era }));
    }
  }

  onModelChange() {
    let data = this.eraSvc.calcularDatosEra();
    data = this.sharedSvc.expandir(data);
    this.store.dispatch(FlujoCajaERAActions.setTablaEra({ items: data }));
  }

  onModelChangeComentario(): void {
    this.store.dispatch(ComentariosActions.setComentarioERA({ comentarioEra: this.comentarioEra }));
  }

  addElement(nodo: any) {
    this.eraSvc.addElement(nodo);
    let data = this.eraSvc.calcularDatosEra();
    data = this.sharedSvc.expandir(data);
    this.store.dispatch(FlujoCajaERAActions.setTablaEra({ items: data }));
  }

  deleteElement(nodo: any) {
    this.eraSvc.deleteElement(nodo);
    let data = this.eraSvc.calcularDatosEra();
    data = this.sharedSvc.expandir(data);
    this.store.dispatch(FlujoCajaERAActions.setTablaEra({ items: data }));
  }

  editElement(nodo) {
    this.eraSvc.editElement(nodo);
  }

  verificarCeldaEditable(codItem): boolean {
    return !FlujoCajaItemConstants.itemsNoEditablesERA.includes(codItem);
  }

  verificarCeldaDinamica(codItem): boolean {
    return FlujoCajaItemConstants.itemsDinamicosERA.includes(codItem);
  }

  obtenerMesAnioActual(): string {
    let fechaActual = new Date();
    const mes = fechaActual.toLocaleString("es-PE", { month: "short" });
    const anio = fechaActual.toLocaleString("es-PE", { year: "2-digit" });
    return mes.replace(".", "").toUpperCase() + " - " + anio;
  }
}
