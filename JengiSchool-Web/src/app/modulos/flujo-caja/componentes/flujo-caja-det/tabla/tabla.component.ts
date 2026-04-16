import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TreeNode } from 'primeng/api';
import { AppState } from 'src/app/app.state';
import { ParametroDPDModal } from 'src/app/models/parametroDPD.interface';
import { ModalService } from '../../../modal/modal.service';
import { FlujoCajaItemConstants } from 'src/app/shared/common/flujoCajaItemConstants';
import { ParametroDPIModal } from 'src/app/models/parametroDPI.interface';
import { FlujoCaja, FlujoCajaDPI } from 'src/app/models/flujocaja.interface';
import { HojaProducto } from 'src/app/models/hojaProducto.interface';
import * as FlujoCajaDetalleActions from 'src/app/redux/actions/flujo-caja/fcdetalle.actions';
import { ActivatedRoute } from '@angular/router';
import { Column, Solicitud } from 'src/app/models/solicitud.interface';
import { SolicitudService } from 'src/app/services/solicitud.service';
import { SharedFlujoCajaService } from 'src/app/services/shared/shared.flujoCaja.service';
import { SharedFCDetalleService } from 'src/app/services/shared/shared.fcdetalle.service';
import dayjs from 'dayjs';
import 'dayjs/locale/es'
import { SharedService } from 'src/app/services/shared/shared.service';
import { selectTablaFCDetalle } from 'src/app/redux/selectors/flujo-caja/fcdetalle.selectors';
import { selectIsEditableFC, selectMontoGUF } from 'src/app/redux/selectors/shared/shared.selectors';
import { selectHojaProducto } from 'src/app/redux/selectors/hoja-producto/hoja.producto.selectors';
import { selectSolicitud } from 'src/app/redux/selectors/flujo-caja/solicitud.selectors';
import { selectTablaESFA } from 'src/app/redux/selectors/flujo-caja/esfa.selectors';
import { selectPdr } from 'src/app/redux/selectors/flujo-caja/pdr.selectors';
import { selectFCData, selectFlujoCaja } from 'src/app/redux/selectors/flujo-caja/flujo.caja.selectors';
import { selectSensibilizaciones } from 'src/app/redux/selectors/flujo-caja/sensibilizaciones.selectors';
import { selectFlujoCajaHP } from 'src/app/redux/selectors/flujo-caja/hp.selectors';
import { ParametroVersionFC } from 'src/app/models/parametroVersionFC.interface';
dayjs.locale('es')


@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css']
})




//"data":{  
  //"name":"Applications",
  //"size":"200mb",
  //"type":"Folder"
//},

export class TablaComponent implements OnInit {

  solicitud: Solicitud;
  flujoCaja: FlujoCaja;
  data: any[] = [];
  parametrosDPD: ParametroDPDModal[] = [];
  parametrosDPI: ParametroDPIModal[] = [];
  periodos: any[] = [];
  periodos_tabla: string[] = [];

  montoESFA: number = 0;

  hojaProducto: HojaProducto[] = [];
  ultimoItem: number = 17;

  mdl_cantidadUP: number = 0;
  mdl_precio: number = 0;
  mdl_rendimiento: number = 0;
  isEditableFC: boolean = false;

  frozenCols!: Column[];

  scrollableCols!: Column[];

  allColumns : Column[];


  constructor(private store: Store<AppState>
    , private modalService: ModalService
    , private route: ActivatedRoute
    , private sharedSvc: SharedService
    , private solicitudSvc: SolicitudService
    , private sharedFCSvc: SharedFlujoCajaService
    , private sharedTablaFCSvc: SharedFCDetalleService) { }

  checkObjectIsEmpty(obj) {
    if (Object.keys(obj).length === 0)
      return false;
    else
      return true;
  }

  padWithLeadingZeros(num, totalLength) {
    return String(num).padStart(totalLength, '0');
  }

  ngOnInit(): void {

    this.store.select(selectFCData).subscribe({
      next : data =>{
        this.flujoCaja = data.flujoCaja;
      }
    })

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
    this.store.select(selectHojaProducto).subscribe({
      next: data => {
        if (data) {
          this.hojaProducto = data;
        }
      }
    });
    this.store.select(selectTablaFCDetalle).subscribe({
      next: data => {
        if (data && data.length > 0) {
          this.periodos_tabla = this.sharedTablaFCSvc.getPeriodos();
          data = this.sharedSvc.expandir(data);
          this.data = data.map(item => ({ ...item }));
        }
      }
    });

    let arrIni : Column[] = [{field:'Valor Inicial',header:'Valor Inicial'}];
    let arrFin : Column[] = [{field:'Valor Restante',header:'Valor Restante'}
                          , {field:'TOTAL',header:'TOTAL'}];

    let arrPlazo : Column[]=[];
    this.periodos_tabla.forEach(element => {
      arrPlazo.push({field:element,header:element})
    });
    
    this.scrollableCols = arrIni.concat(arrPlazo).concat(arrFin);

    this.frozenCols = [{ field: 'mac', header: 'Items de Flujo de Caja' }];

    this.allColumns = this.frozenCols.concat(this.scrollableCols);

    this.store.select(selectMontoGUF).subscribe({
      next: montoGUF => {
        let GUF = this.sharedTablaFCSvc.obtenerNodoHijo('FCD004', 'FCD007');
        if (montoGUF > 0)
          montoGUF = montoGUF * (-1);
        if (GUF) {
          GUF.data.valorInicial = montoGUF;
          GUF.data.valorRestante = montoGUF;
          GUF.data.montosPlazo = GUF.data.montosPlazo.map(p => ({ ...p, monto: montoGUF }));
          let data = this.sharedTablaFCSvc.calcularTablaFC();
          data = this.sharedSvc.expandir(data);
          this.store.dispatch(FlujoCajaDetalleActions.setTablaFCDetalle({ items: data }));
        }
      }
    });
    this.store.select(selectTablaESFA).subscribe({
      next: data => {
        setTimeout(() => {
          if (data) {
            let nodoESFA = data.find(nodo => nodo.data.codItem === 'ESF001');
            if (nodoESFA) {
              let pasivoCorriente = nodoESFA.children.find(nodo => nodo.data.codItem === 'ESF017');
              let activoCorriente = nodoESFA.children.find(nodo => nodo.data.codItem === 'ESF002')
              if (activoCorriente) {
                let efectivo = activoCorriente.children.find(nodo => nodo.data.codItem === 'ESF003');
                this.sharedTablaFCSvc.establecerDisponibleSaldoCajaValorInicial(efectivo);
              }

              if (pasivoCorriente) {
                if (pasivoCorriente.children){ //&& pasivoCorriente.children.length > 1) {
                  nodoESFA.children = [...nodoESFA.children];

                  let entidadesFinancieras = pasivoCorriente.children;

                  if (pasivoCorriente.data.flag == 0 || !pasivoCorriente.data.flag) {
                    this.sharedTablaFCSvc.agregarEntidadFinanciera(entidadesFinancieras);
                  }
                  if (pasivoCorriente.data.flag == 2) {
                    this.sharedTablaFCSvc.deleteEntidadFinanciera(entidadesFinancieras);
                  }
                  // if()
                  let data = this.sharedTablaFCSvc.calcularTablaFC();
                  data = this.sharedSvc.expandir(data);

                  this.store.dispatch(FlujoCajaDetalleActions.setTablaFCDetalle({ items: data }));
                }
              }
            }
          }
        }, 1000);

      }
    });
    this.store.select(selectPdr).subscribe({
      next: data => {
        this.sharedTablaFCSvc.calcularPlanDesembolsoReferencial(data);
      }
    });

    this.store.select(selectSensibilizaciones).subscribe({
      next: data => {
        this.sharedTablaFCSvc.recalcular();
      },
    })

    this.store.select(selectFlujoCajaHP).subscribe({
      next: data => {
        this.sharedTablaFCSvc.recalcular();
      },
    })

    /*
    this.store.select(selectFC).subscribe({
      next: (data) => {
        this.parametrosDPD = data.parametrosDPD;
        this.parametrosDPI = data.parametrosDPI;
      }
    })
    */

  }
  

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  verData(data: any) {
    let found = this.obtenerProductoHP(data.descripcion);
    if (found) {
      this.mdl_cantidadUP = data.cantidadUP;
      this.mdl_precio = found.precio;
      this.mdl_rendimiento = found.rendimiento;
    } else {
      this.mdl_cantidadUP = data.cantidadUP;
      this.mdl_precio = 0;
      this.mdl_rendimiento = 0;
    }
  }

  obtenerProductoHP(codigoHP: string) {
    let found = this.hojaProducto.find(item => item.codigoHP === codigoHP);
    return found;
  }

  editarElemento(Nodo: any) {

    this.sharedTablaFCSvc.editarElemento(Nodo);
    this.data = this.sharedSvc.expandir(this.data);
  }

  onModelChange() {
    let data = this.sharedTablaFCSvc.calcularTablaFC();
    data = this.sharedSvc.expandir(data);
    this.store.dispatch(FlujoCajaDetalleActions.setTablaFCDetalle({ items: data }));
    //this.store.dispatch(SharedActions.isCompletedGUF({ isCompleted }));
  }

  agregarFila(Node: TreeNode) {
    this.sharedTablaFCSvc.agregarFila(Node);
    let data = this.sharedTablaFCSvc.calcularTablaFC();
    data = this.sharedSvc.expandir(data);
    this.store.dispatch(FlujoCajaDetalleActions.setTablaFCDetalle({ items: data }));
  }

  quitarFila(Nodo: any) {
    this.sharedTablaFCSvc.quitarFila(Nodo);
    let data = this.sharedTablaFCSvc.calcularTablaFC();
    data = this.sharedSvc.expandir(data);
    this.store.dispatch(FlujoCajaDetalleActions.setTablaFCDetalle({ items: data }));
  }

  obtenerNodo(codItem: string) {
    let nodo = this.data.find(nodo => nodo.data.codItem === codItem);
    if (nodo) {
      if (nodo.data.montosPlazo === null) {
        if (nodo.children && nodo.children.length > 0) {
          nodo.children.forEach(child => {
            if (child) {
              if (child.data.montosPlazo === null) {
                child.data.montosPlazo = []
              }
            }
          })
        }
        nodo.data.montosPlazo = []
      }
    }
    return nodo;
  }

  obtenerNodoHijo(codItemPadre: string, codItem: string) {
    let nodo = this.obtenerNodo(codItemPadre);
    if (nodo) {
      if (nodo.children && nodo.children.length > 0) {
        nodo.children.forEach(child => {
          if (child) {
            if (child.data.montosPlazo === null) {
              child.data.montosPlazo = []
            }
          }
        })
        return nodo.children.find(child => child.data.codItem === codItem);
      }
    }
  }

  //#region [ Verificar Celdas ]
  verificarCeldaDinamica(codItem): boolean {
    if (this.isEditableFC) {
      return FlujoCajaItemConstants.itemsDinamicosFC.includes(codItem);
    } else {
      return false;
    }
  }
  verificarNodoMdlEstablecerPorPadre(codItem): boolean {
    if (this.isEditableFC) {
      return FlujoCajaItemConstants.itemsEstablecerValorPorPadreFC.includes(codItem);
    } else {
      return false;
    }
  }
  verificarNodoMdlEstablecer(codItem): boolean {
    if (this.isEditableFC) {
      return FlujoCajaItemConstants.itemsEstablecerValorFC.includes(codItem);
    } else {
      return false;
    }
  }
  verificarCeldaItemSC(codItem): boolean {
    let result = FlujoCajaItemConstants.itemsIngresoEgresoFC.includes(codItem);
    return result;
  }
  verificarNodosFlujoProyecto(codItem): boolean {
    let result = FlujoCajaItemConstants.itemsFlujoProyecto.includes(codItem);
    return result;
  }
  verificarNodoGUF(codItem): boolean {
    return FlujoCajaItemConstants.itemGufFC.includes(codItem);
  }
  verificarCeldaEditableFlujoFinanciero(codItem): boolean {
    return FlujoCajaItemConstants.itemCeldaNoEditableFlujoFinancieroCuotasAmortizacionesFC.includes(codItem);
  }
  verificarCeldaEditableFlujoFinancieroMonto(codItem): boolean {
    return FlujoCajaItemConstants.itemCeldaNoEditableFlujoFinancieroMontoCreditoFC.includes(codItem);
  }

  verificarCeldaEditableFlujoFinancieroMontoValorRestante(codItem): boolean {
    return FlujoCajaItemConstants.itemCeldaNoEditableFlujoFinancieroMontoCreditoValorRestanteFC.includes(codItem);
  }

  verificarCeldaEditableExcedenteMensual(codItem): boolean {
    return FlujoCajaItemConstants.itemCeldaNoEditableExcedenteMensualFC.includes(codItem);
  }

  verificarCeldaEditableExcedenteFinal(codItem): boolean {
    return FlujoCajaItemConstants.itemCeldaNoEditableExcedenteFinalFC.includes(codItem);
  }

  // verificarCeldaEditableEntidadesBancarias(item): boolean {
  //   if(item.flag !== undefined){
  //     return true;
  //   }else {
  //     return false;
  //   }

  // }
  //#endregion

  //#region [ Modales - DPD y DPI / Establecer Valor ]
  mostrarMdl(codItem: string) {
    //if (!this.isEditableFC) {
    const Constant_DPD = "FCD009";
    const Constant_DPI = "FCD010";
    switch (codItem) {
      case Constant_DPD:
        this.abrirMdlDPD();
        break;
      case Constant_DPI:
        this.abrirMdlDPI();
        break;
    }
    //}
  }

  abrirMdlDPD() {
    //if (this.isEditableFC) {
    const dialogRef = this.modalService.abrirFlujoCajaModalDPD();
    dialogRef.afterClosed().subscribe((data) => {
      if (data && data.success) {
        let dpd = this.obtenerNodoHijo(FlujoCajaItemConstants.EgresosFinancieros, FlujoCajaItemConstants.EgresosFinancieros_DeudaPotencialDirecta);
        dpd.data.valorInicial = data.data;
        dpd.data.montosPlazo.forEach(async item => {
          item.monto = await data.data;
        });
        dpd.data.valorRestante = data.data;
        this.onModelChange();
      }
    });
    //}
  }

  hash = new Map<string, string>();
  abrirMdlDPI() {
    //if (this.isEditableFC) {
    const dialogRef = this.modalService.abrirFlujoCajaModalDPI();
    dialogRef.afterClosed().subscribe(async data => {
      if (data && data.success) {
        let dpi = this.obtenerNodoHijo(FlujoCajaItemConstants.EgresosFinancieros, FlujoCajaItemConstants.EgresosFinancieros_DeudaPotencialIndirecta);
        dpi.data.valorInicial = data.data;
        dpi.data.montosPlazo.forEach( async item => {
        item.monto = await data.data;
        });
        dpi.data.valorRestante = data.data;

        this.onModelChange();
      }
    });
    //}
  }

  abrirMdlEstablecerValor(Nodo: any) {
    const dialogRef = this.modalService.abrirModalEstablecerValorFC();
    dialogRef.afterClosed().subscribe((data) => {
      if (data && data.success) {
        Nodo['montosPlazo'] = Nodo.montosPlazo.map(p => ({ ...p, monto: data.data }));
        this.onModelChange();
      }
    });
  }
}