import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { FlujoCajaService } from 'src/app/services/flujo-caja.service';
import { FlujoCajaItemConstants } from 'src/app/shared/common/flujoCajaItemConstants';
import { FlujoCaja } from 'src/app/models/flujocaja.interface';
import { SharedFlujoCajaService } from 'src/app/services/shared/shared.flujoCaja.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { SharedESFAService } from 'src/app/services/shared/shared.esfa.service';
import { selectTablaESFA } from 'src/app/redux/selectors/flujo-caja/esfa.selectors';
import { FlujoCajaESFA, FlujoCajaESFAItem } from 'src/app/models/flujoCajaESFA.interface';
import * as FlujoCajaESFAActions from '../../../../redux/actions/flujo-caja/esfa.actions';
import { selectIsEditableFC } from 'src/app/redux/selectors/shared/shared.selectors';
import { ParametroESFA } from 'src/app/models/parametroESFA.interface';
import { DataService } from 'src/app/services/data.service';
import { ParametroVersion } from 'src/app/models/parametroVersion.interface';
import * as ComentariosActions from 'src/app/redux/actions/flujo-caja/comentarios.actions';
import { selectComentarioESFA } from 'src/app/redux/selectors/flujo-caja/comentarios.selectors';
import { ESFAConstants } from 'src/app/shared/common/esfa.constants';
import * as FlujoCajaDetalleActions from 'src/app/redux/actions/flujo-caja/fcdetalle.actions';
import { MessageService } from 'primeng/api';
import { SharedFCDetalleService } from 'src/app/services/shared/shared.fcdetalle.service';
import { selectParametrosESFA } from 'src/app/redux/selectors/flujo-caja/parametros.selectors';

@Component({
  selector: 'app-esfa',
  templateUrl: './esfa.component.html',
  styleUrls: ['./esfa.component.css'],
})
export class EsfaComponent implements OnInit {

  data: FlujoCajaESFA[] = [];
  fc: FlujoCaja;
  mesActual: string = "";
  mesDesembolsoAnterior: string = "";
  fcAnterior: any;
  mesFlujoCaja: string = "";
  isEditableFC: boolean = true;
  editable: boolean = true;
  dataParametros: ParametroVersion[] = [];
  entidadesBancarias: FlujoCajaESFAItem[] = [];
  parametroESFA: string | undefined;
  comentarioEsfa: string = '';
  dataValidate: any = [];
  //selectEntidadBancaria: string;//FlujoCajaESFAItem;

  constructor(
    private flujoCajaService: FlujoCajaService
    , private store: Store<AppState>
    , private sharedFCSvc: SharedFlujoCajaService
    , private sharedSvc: SharedService
    , private esfaSvc: SharedESFAService
    , private dataSvc: DataService
    , private messageSvc: MessageService
    , private sharedTablaFCSvc: SharedFCDetalleService
  ) { }

  ngOnInit(): void {
    this.fcAnterior = this.esfaSvc.getDesembolsoAnterior();
    this.cargarListadoParametros();
  }

  agregarFila(nodo: any) {
    //this.selectEntidadBancaria = null;
    let addNewFile: Boolean = true;
    /*let addNewEFPasivoCorriente = this.esfaSvc.validarAddNewEFPasivoCorriente();
    let addNewEFPasivoNoCorriente = this.esfaSvc.validarAddNewEFPasivoNoCorriente();
    switch (nodo.codItem) {
      case ESFAConstants.TotalActivo_PasivoCorriente:
        if (!addNewEFPasivoCorriente) {
          addNewFile = false;
        }
        break;
      case ESFAConstants.TotalActivo_PasivoNoCorriente:
        if (!addNewEFPasivoNoCorriente) {
          addNewFile = false;
        }
        break;
    }*/
    addNewFile = this.esfaSvc.agregarFila(nodo);
    if (addNewFile) {

      let data = this.esfaSvc.calcularDatosEsfa();
      data = this.sharedSvc.expandir(data);
      let pasivoCorriente = data[0].children.find(e => e.data.codItem === nodo.codItem);
      pasivoCorriente.data.flag = 0;
      this.store.dispatch(FlujoCajaESFAActions.setTablaEsfa({ items: data }));
    } else {
      this.messageSvc.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Seleccione una entidad bancaria.',
        life: 3000
      });
    }
  }

  cargarListadoParametros() {
    this.store.select(selectParametrosESFA).subscribe({
      next: response => {
        response.forEach(e => {
          this.entidadesBancarias.push({
            codItem: '',
            descripcion: e.codigoVersion,
            montoActual: null,
            montoAnterior: 0,
            porcentajeAV: 0,
            porcentajeAH: 0,
            codItemPadre: '',
            descripcionTemp: e.descripcion
          })
        });
        
        this.store.select(selectIsEditableFC).subscribe({
          next: data => { this.isEditableFC = data; }
        });
        this.store.select(selectTablaESFA).subscribe({
          next: data => {
            this.dataValidate = data
            if (data && data.length > 0) {
              data = this.sharedSvc.expandir(data);
              this.data = data.map(item => ({ ...item }));
              this.obtenerNombreEntidadBancaria()
            }
          }
        });
        // this.flujoCajaService
        //   .obtenerAnioMesFlujoCajaAnterior()
        //   .subscribe((response: string) => {
        //     this.mesFlujoCaja = response;
        //   });
        this.mesActual = this.sharedFCSvc.obtenerMesAnioActual();
        this.store.select(selectComentarioESFA).subscribe({
          next: data => {
            this.comentarioEsfa = data;
          }
        });
        if (this.fcAnterior) {
          if (this.fcAnterior.periodoFC != 0) {
            this.mesDesembolsoAnterior = this.sharedFCSvc.obtenerMesAnioByPeriodo(this.fcAnterior.periodoFC);
          } else {
            this.mesDesembolsoAnterior = '-'
          }
        }
      }
    });
  }

  obtenerNombreEntidadBancaria() {
    const totalActivo = this.data.find(e => e.data.codItem == 'ESF001');
    const pasivoCorriente = totalActivo.children.find(e => e.data.codItem == 'ESF017');
    const pasivoNoCorriente = totalActivo.children.find(e => e.data.codItem == 'ESF019');
    pasivoCorriente.children.forEach(e => {
      if (e.data.codItem != 'ESF018') {
        this.entidadesBancarias.forEach(eb => {
          if (eb.descripcion == e.data.descripcion) {
            e.data.selectEntidadBancaria = eb.descripcion;
            e.data.descripcionTemp = eb.descripcionTemp;
          }
        });
      }
    });

    pasivoCorriente.children.sort(function (a, b) {
      var x = a.data.codItem.toLocaleLowerCase();
      var y = b.data.codItem.toLocaleLowerCase();
      return x < y ? -1 : x > y ? 1 : 0;
    })

    pasivoNoCorriente.children.forEach(e => {
      if (e.data.codItem != 'ESF018') {
        this.entidadesBancarias.forEach(eb => {
          if (eb.descripcion == e.data.descripcion) {
            e.data.selectEntidadBancaria = eb.descripcion;
            e.data.descripcionTemp = eb.descripcionTemp
          }
        });
      }
    });

    pasivoNoCorriente.children.sort(function (a, b) {
      var x = a.data.codItem.toLocaleLowerCase();
      var y = b.data.codItem.toLocaleLowerCase();
      return x < y ? -1 : x > y ? 1 : 0;
    })
  }

  ObtenerEntidad(codigo: string): string {
    let nombreEntidad: string = "";
    this.entidadesBancarias.forEach(eb => {
      if (eb.descripcion == codigo) {
        nombreEntidad = eb.descripcionTemp
      }
    });
    return nombreEntidad;
  }

  editarElemento(nodo: any) {
    let encontrado = false;
    const datosModificar = [...this.dataValidate]
    datosModificar[0].children.forEach(element => {
      if (element.data.codItem == nodo.codItemPadre) {
        const buscarBancosDuplicados = element.children.filter(item => item.data.descripcion == nodo.selectEntidadBancaria);
        if (buscarBancosDuplicados.length == 0) {
          encontrado = false;
          element.children.forEach(subElementos => {
            if (subElementos.data.codItem == nodo.codItem && element.data.codItem == nodo.codItemPadre) {
              subElementos.data.lastDescripcion = subElementos.data.descripcion;
              subElementos.data.descripcion = nodo.selectEntidadBancaria;//this.selectEntidadBancaria.descripcion;
              subElementos.data.descripcionTemp = this.ObtenerEntidad(nodo.selectEntidadBancaria)//this.selectEntidadBancaria.descripcionTemp;
            }
          })
        } else {
          encontrado = true;
        }
      }
    });

    if (!encontrado) {
      //this.selectEntidadBancaria = null;
      let data = this.esfaSvc.calcularDatosEsfa();
      data = this.sharedSvc.expandir(data);
      this.store.dispatch(FlujoCajaESFAActions.setTablaEsfa({ items: data }));
    } else {
      this.messageSvc.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Esta entidad bancaria ya se encuentra seleccionada.',
        life: 3000
      });
    }
  }

  deleteElement(nodo: any) {
    const datosModificar = [...this.dataValidate]
    datosModificar[0].children.forEach(element => {
      if (element.data.codItem == nodo.codItemPadre) {
        element.children.forEach((subElementos, index) => {
          if (subElementos.data.codItem == nodo.codItem) {
            element.children.splice(index, 1)
          }
        })
      }
    });

    let data = this.esfaSvc.calcularDatosEsfa();
    data = this.sharedSvc.expandir(data);
    let pasivoCorriente = data[0].children.find(nodo => nodo.data.codItem === 'ESF017');
    pasivoCorriente.data.flag = 2;
    this.store.dispatch(FlujoCajaESFAActions.setTablaEsfa({ items: data }));


    /*this.sharedTablaFCSvc.quitarFilaEntidadFinanciera(Nodo);
    let data1 = this.sharedTablaFCSvc.calcularTablaFC();
    data = this.sharedSvc.expandir(data1);
    this.store.dispatch(FlujoCajaDetalleActions.setTablaFCDetalle({ items: data }));*/
  }

  verificarCeldaEditable(codItem): boolean {
    return !FlujoCajaItemConstants.itemsNoEditablesESFA.includes(codItem);
  }

  verificarCeldaDinamica(codItem): boolean {
    return FlujoCajaItemConstants.itemsDinamicos.includes(codItem);
  }

  onModelChange() {
    let data = this.esfaSvc.calcularDatosEsfa();
    data = this.sharedSvc.expandir(data);
    let pasivoCorriente = data[0].children.find(nodo => nodo.data.codItem === 'ESF017');
    pasivoCorriente.data.flag = 1;
    this.store.dispatch(FlujoCajaESFAActions.setTablaEsfa({ items: data }));
  }


  onModelChangeComentario(): void {
    this.store.dispatch(ComentariosActions.setComentarioESFA({ comentarioEsfa: this.comentarioEsfa }));
  }

  verificarEntidadBancaria(valor: any): boolean {
    return isNaN(valor);
  }
}
