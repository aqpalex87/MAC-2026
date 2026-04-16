import { Injectable } from '@angular/core';
import { SharedService } from './shared.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import * as SharedActions from 'src/app/redux/actions/shared/shared.actions';
import { FlujoCajaESFA, FlujoCajaESFAItem } from 'src/app/models/flujoCajaESFA.interface';
import { ESFAConstants } from 'src/app/shared/common/esfa.constants';
import { FlujoCajaItemConstants } from 'src/app/shared/common/flujoCajaItemConstants';
import { FlujoCaja, FlujoCajaDPD, FlujoCajaDPI, FlujoCajaPDR } from 'src/app/models/flujocaja.interface';
import { SharedRSEService } from 'src/app/services/shared/shared.rse.service';
import { TreeNode } from 'primeng/api';
import { Solicitud } from 'src/app/models/solicitud.interface';
import * as FlujoCajaRSEActions from 'src/app/redux/actions/flujo-caja/rse.actions';
import dayjs from 'dayjs';
import 'dayjs/locale/es'
import { ConsultarfcModule } from 'src/app/modulos/consultar-fc/consulta-fc.module';
import { HojaProducto } from 'src/app/models/hojaProducto.interface';
import { ParametroVersionFC } from 'src/app/models/parametroVersionFC.interface';
dayjs.locale('es')

@Injectable({
    providedIn: 'root'
})
export class SharedFCDetalleService {

    ultimoItem: number = 17;
    periodos: any[] = [];
    periodos_tabla: string[] = [];
    montoESFA: number = 0;

    constructor(private sharedSvc: SharedService
        , private store: Store<AppState>
        , private rseSvc: SharedRSEService) { }

    private data: any[] = [];
    private solicitud: Solicitud;
    private flujoCaja: FlujoCaja;
    private datosHojaProducto: HojaProducto[];
    private parametrosVersionFC: ParametroVersionFC;
    hash = new Map<string, string>();

    checkObjectIsEmpty(obj) {
        if (Object.keys(obj).length === 0) {
            return false;
        } else {
            return true;
        }
    }

    padWithLeadingZeros(num, totalLength) {
        return String(num).padStart(totalLength, '0');
    }

    setDataHP(datosHP: HojaProducto[]) {
        this.datosHojaProducto = datosHP;
    }

    setData(parametroVersionFC: ParametroVersionFC, fcTree: any[], solicitud: Solicitud, flujoCaja: FlujoCaja, modo: string) {
        this.parametrosVersionFC = parametroVersionFC;
        this.flujoCaja = flujoCaja;
        this.solicitud = solicitud;
        this.data = fcTree;
        this.periodos_tabla = [];
        if (this.data.length != 0) {
            this.periodos = this.data[0]['data']['montosPlazo'];
        }
        if (this.periodos && this.periodos.length > 0) {
            this.periodos.forEach(item => {
                let date = dayjs(item['anio'] + '-' + item['mes']).format('MMM-YY');
                this.periodos_tabla.push(date);
            });
        } else {
            this.periodos = [];
        }
        if (modo === 'NUEVO') {
            this.agregarProductoCredito(solicitud);
        }

        if (modo === 'EDITAR') {
            //this.agregarIngresoFlujoOtrasActividades();
        }

        this.hash.set('1', 'Normal')
        this.hash.set('2', 'CPP')
        this.hash.set('3', 'Deficiente')
        this.hash.set('4', 'Dudoso')
        this.hash.set('5', 'Perdida')
    }

    findLastItemDFS(): number {
        let max = 0;
        for (let i = 0; i < this.data.length; i++) {
            let item = this.data[i];
            let codItem = Number(item.data.codItem.substring(3));
            max = codItem > max ? codItem : max;
            for (let j = 0; j < item.children.length; j++) {
                let child = item.children[j];
                let codChild = Number(child.data.codItem.substring(3));
                max = codChild > max ? codChild : max;
                for (let k = 0; k < child.children.length; k++) {
                    let childChild = child.children[k];
                    let codChildChild = Number(childChild.data.codItem.substring(3));
                    max = codChildChild > max ? codChildChild : max;
                }
            }
        }
        return max;
    }

    getData() {
        return this.data;
    }

    calcularTablaFC() {
        this.recalcular();
        this.isCompletedFC();
        return this.data;
    }

    getPeriodos() {
        return this.periodos_tabla;
    }

    calcularESFA() {
        this.recalcular();
    }

    isCompletedFC() {
        let completed: boolean = true;
        let listData = this.sharedSvc.convertTreeToList(this.data);

        // // this.data[4].children[1].data.total = 11000;

        let FCD015 = listData.find(item => item.codItem === FlujoCajaItemConstants.FlujoFinanciero_CuotasAmortizaciones);
        if (FCD015) {
            var totalCoutas = FCD015.montosPlazo.reduce((acumulador, child) => { return acumulador + child.monto }, 0);
            if (totalCoutas < this.solicitud.montoSolicitado) {
                completed = false
            }
        }
        let FCD017 = listData.find(item => item.codItem === FlujoCajaItemConstants.FlujoProyecto_IngresosAgropecuarios_ProductoSC);
        let FCD018 = listData.find(item => item.codItem === FlujoCajaItemConstants.FlujoProyecto_EgresosAgropecuarios_ProductoSC);
        if (FCD017 && FCD018) {
            let porcentajeIngreso = FCD017 ? FCD017.total : 0;
            let porcentajeEgreso = FCD018 ? FCD018.total : 0;
            if (porcentajeIngreso != 100 || porcentajeEgreso != 100) {
                completed = false;
            }
        }
        this.store.dispatch(SharedActions.isCompletedFC({ isCompleted: completed }));
    }

    editarElemento(Nodo: any) {
        switch (Nodo.codItemPadre) {
            case FlujoCajaItemConstants.FlujoProyecto_IngresosAgropecuarios:
                let FCD001 = this.obtenerNodo(FlujoCajaItemConstants.FlujoProyecto);
                let FCD002 = this.obtenerNodoHijo(FlujoCajaItemConstants.FlujoProyecto, FlujoCajaItemConstants.FlujoProyecto_IngresosAgropecuarios);
                let FCD003 = this.obtenerNodoHijo(FlujoCajaItemConstants.FlujoProyecto, FlujoCajaItemConstants.FlujoProyecto_EgresosAgropecuarios);
                if (FCD001 && FCD002 && FCD003) {
                    let index = FCD002.children.map(function (child) { return child.data.codItem }).indexOf(Nodo.codItem);
                    let elementFCD002 = FCD002.children[index];
                    let elementFCD003 = FCD003.children[index];
                    elementFCD003.data.descripcion = elementFCD002.data.descripcion;
                    elementFCD003.data.cantidadUP = elementFCD002.data.cantidadUP;
                }
                break;
            case FlujoCajaItemConstants.FlujoOtrasActividades_Ingresos:
                let FCD004 = this.obtenerNodo(FlujoCajaItemConstants.FlujoOtrasActividades);
                let FCD005 = this.obtenerNodoHijo(FlujoCajaItemConstants.FlujoOtrasActividades, FlujoCajaItemConstants.FlujoOtrasActividades_Ingresos);
                let FCD006 = this.obtenerNodoHijo(FlujoCajaItemConstants.FlujoOtrasActividades, FlujoCajaItemConstants.FlujoOtrasActividades_Egresos);
                if (FCD004 && FCD005 && FCD006) {
                    let index = FCD005.children.map(function (child) { return child.data.codItem }).indexOf(Nodo.codItem);
                    let elementFCD005 = FCD005.children[index];
                    let elementFCD006 = FCD006.children[index];
                    if (elementFCD005 && elementFCD006) {
                        if (elementFCD005.data) {
                            elementFCD006.data.descripcion = elementFCD005.data.descripcion;
                        }
                        if (elementFCD006.data) {
                            elementFCD005.data.descripcion = elementFCD006.data.descripcion;
                        }
                    }
                }
                break;
        }
        this.recalcular()
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

    recalcular() {
        this.calcularFCD001();
        this.calcularFCD004();
        this.calcularFCD008();
        this.calcularFCD011();
        this.calcularFCD012();
    }

    calcularPlanDesembolsoReferencial(pdr: FlujoCajaPDR[]) {
        let nodo = this.obtenerNodoHijo('FCD012', 'FCD014');
        if (nodo) {
            nodo.data.valorInicial = 0;
            nodo.data.montosPlazo = nodo.data.montosPlazo.map(p => ({ ...p, monto: 0 }));
            nodo.data.valorRestante = 0;
            nodo.data.total = 0;
            if (pdr && pdr.length > 0) {
                let primerPdr = pdr.find(item => item.numero === 1);
                if (primerPdr != undefined) {
                    let valorInicial = ((primerPdr.porcentaje / 100) * this.solicitud.montoSolicitado);
                    nodo.data.valorInicial = valorInicial;
                    pdr.forEach(item => {
                        if (item.mes - 1 <= nodo.data.montosPlazo.length) {
                            let mes = nodo.data.montosPlazo[item.mes - 1]//.find(element => element.mes === item.mes)
                            if (mes) {
                                mes.monto = ((item.porcentaje / 100) * this.solicitud.montoSolicitado);
                            }
                        }
                    });
                }
            }
        }
        this.recalcular();
    }

    establecerDisponibleSaldoCajaValorInicial(efectivo: any) {
        let nodo = this.obtenerNodoHijo('FCD012', 'FCD013');
        if (nodo) nodo.data.valorInicial = efectivo.data.montoActual;
    }

    //#region [ (Agregar/Quitar) Item - SC / Adicional ]
    agregarEntidadFinanciera(entidadesFinancieras: any[]) {
        let nodo = this.obtenerNodo('FCD008');
        if (nodo) {
            nodo.children.forEach((e, i) => {
                if (e.data.descripcion == undefined) {
                    nodo.children.splice(i, 1);
                }
            });

            nodo.children.forEach(e => {
                if (e.data.codItem == FlujoCajaItemConstants.EgresosFinancieros_DeudaPotencialDirecta
                    || e.data.codItem == FlujoCajaItemConstants.EgresosFinancieros_DeudaPotencialIndirecta) {
                    e.data.isEF = false;
                    e.data.valorInicial = 0;
                    e.data.valorRestante = 0;
                } else {
                    e.data.isEF = true;
                }
            })
            
            entidadesFinancieras.forEach(e => {
                if (e.data.codItem != 'ESF018') {
                    //console.log("EF", e.data);
                    let descripcion = e.data.descripcion
                    let codItem = e.data.codItem
                    const newItem: any = {
                        data: {
                            codItem: "FCD" + this.padWithLeadingZeros(this.findLastItemDFS() + 1, 3),
                            descripcion: descripcion,
                            descripcionTemp: e.data.descripcionTemp,
                            cantidadUP: 0,
                            valorInicial: 0,
                            montosPlazo: this.periodos.map(p => ({ ...p, monto: 0 })),
                            valorRestante: 0,
                            total: 0.0,
                            codItemPadre: 'FCD008',
                            codItemESFA: e.data.codItem,
                            isEF: true
                        },
                        children: []
                    };

                    if (nodo.children.filter(a => a.data.descripcion === e.data.lastDescripcion).length == 0) {
                        let existe = false;
                        nodo.children.forEach((e, i) => {
                            if (e.data.descripcion == descripcion) {
                                existe = true;
                            }
                        });
                        if (!existe && descripcion != undefined && descripcion != '') {
                            nodo.children = [...nodo.children, newItem];
                            this.ultimoItem++;
                        }
                    } else {
                        nodo.children.forEach((h, i) => {
                            if (h.data.descripcion === e.data.lastDescripcion) {
                                h.data.descripcion = descripcion;
                                h.data.descripcionTemp = e.data.descripcionTemp
                            }
                        });
                    }
                }
            });
        }

    }


    deleteEntidadFinanciera(entidadesFinancieras: any[]) {
        let nodo = this.obtenerNodo('FCD008');
        let flagAgregar = true;
        let itemsTemporales = [];

        nodo.children.forEach((e, i) => {
            if (e.data.descripcion == undefined) {
                nodo.children.splice(i, 1);
            }
            else {
                entidadesFinancieras.forEach((ef, y) => {
                    if (y >= 1) {
                        /*if (ef.data.descripcionTemp == e.data.descripcion) {
                            flagAgregar = true;
                            itemsTemporales = [...itemsTemporales, e];
                        }*/
                    }
                    else if (i >= 2) {
                    }
                    else {
                        itemsTemporales = [...itemsTemporales, e]
                    }
                });
            }
        });
        
        let itemsEF = nodo.children.filter(item=>entidadesFinancieras.some(item1=>item1.data.descripcion === item.data.descripcion));
        itemsTemporales = [...itemsTemporales,...itemsEF]
        nodo.children = [];
        nodo.children = itemsTemporales;
    }

    agregarFila(Node: TreeNode) {
        let nodo = this.obtenerNodo(Node['codItemPadre']);
        nodo.children.forEach(child => {
            if (child.data.codItem != FlujoCajaItemConstants.FlujoOtrasActividades_GUF) {
                const newItem: any = {
                    data: {
                        codItem: "FCD" + this.padWithLeadingZeros(this.findLastItemDFS() + 1, 3),
                        cantidadUP: 0,
                        valorInicial: null,
                        montosPlazo: this.periodos.map(p => ({ ...p, monto: null })),
                        valorRestante: null,
                        total: 0.0,
                        codItemPadre: child.data.codItem
                    },
                    children: []
                };
                child.children = [...child.children, newItem];
                this.ultimoItem++;
            }
        })
        this.recalcular();
    }

    agregarProductoCredito(solicitud: Solicitud) {
        let flujoProyecto = this.obtenerNodo(FlujoCajaItemConstants.FlujoProyecto);
        flujoProyecto.children.forEach(child => {
            const newItem: any = {
                data: {
                    codItem: "FCD" + this.padWithLeadingZeros(this.findLastItemDFS() + 1, 3),
                    cantidadUP: solicitud.cantidadFinanciar,
                    descripcion: solicitud.producto,
                    valorInicial: null,
                    montosPlazo: this.periodos.map(p => ({ ...p, monto: null })),
                    valorRestante: null,
                    total: 0.0,
                    codItemPadre: child.data.codItem
                },
                children: []
            };
            child.children = [...child.children, newItem];
            this.ultimoItem++;
        });
        this.recalcular();
    }

    agregarIngresoFlujoOtrasActividades() {
        let flujoOtrasActividades = this.obtenerNodo(FlujoCajaItemConstants.FlujoOtrasActividades);
        if (flujoOtrasActividades) {
            if (flujoOtrasActividades.children && flujoOtrasActividades.children.length > 0) {
                let nodoIngresosFCD005 = this.obtenerNodoHijo(FlujoCajaItemConstants.FlujoOtrasActividades, FlujoCajaItemConstants.FlujoOtrasActividades_Ingresos);
                if (nodoIngresosFCD005) {
                    const newItem: any = {
                        data: {
                            codItem: "FCD" + this.padWithLeadingZeros(this.findLastItemDFS() + 1, 3),
                            cantidadUP: 0,
                            valorInicial: null,
                            montosPlazo: this.periodos.map(p => ({ ...p, monto: null })),
                            valorRestante: null,
                            total: 0.0,
                            codItemPadre: nodoIngresosFCD005.data.codItem
                        },
                        children: []
                    };
                    nodoIngresosFCD005.children = [...nodoIngresosFCD005.children, newItem];
                    this.ultimoItem++;
                }
            }
            this.recalcular();
        }
    }

    quitarFilaEntidadFinanciera(Nodo: any) { }

    quitarFila(Nodo: any) {
        switch (Nodo.codItemPadre) {
            case FlujoCajaItemConstants.FlujoProyecto_IngresosAgropecuarios:
                let FPingresosAgropecuarios = this.obtenerNodoHijo(FlujoCajaItemConstants.FlujoProyecto, FlujoCajaItemConstants.FlujoProyecto_IngresosAgropecuarios);
                let FPegresosAgropecuarios = this.obtenerNodoHijo(FlujoCajaItemConstants.FlujoProyecto, FlujoCajaItemConstants.FlujoProyecto_EgresosAgropecuarios);
                if (FPingresosAgropecuarios && FPegresosAgropecuarios) {
                    if (FPingresosAgropecuarios.children && FPingresosAgropecuarios.children.length > 0) {
                        let index = FPingresosAgropecuarios.children.map(function (child) { return child.data.codItem }).indexOf(Nodo.codItem);
                        FPingresosAgropecuarios.children.splice(index, 1);
                        FPegresosAgropecuarios.children.splice(index, 1);
                    }
                }
                break;
            case FlujoCajaItemConstants.FlujoOtrasActividades_Ingresos:
                let FOAingresos = this.obtenerNodoHijo(FlujoCajaItemConstants.FlujoOtrasActividades, FlujoCajaItemConstants.FlujoOtrasActividades_Ingresos);
                let FOAegresos = this.obtenerNodoHijo(FlujoCajaItemConstants.FlujoOtrasActividades, FlujoCajaItemConstants.FlujoOtrasActividades_Egresos);
                if (FOAingresos && FOAegresos) {
                    if (FOAingresos.children && FOAingresos.children.length > 0) {
                        let index = FOAingresos.children.map(function (child) { return child.data.codItem }).indexOf(Nodo.codItem);
                        FOAingresos.children.splice(index, 1);
                        FOAegresos.children.splice(index - 1, 1);
                    }
                }
                break;
        }
        this.recalcular();
    }

    removeChildrenOfNode(children: [], codItem: string) {
        return children.filter(item => item['data']['codItem'] !== codItem);
    }
    //#endregion

    //#region [ Calculo - FCD001 ]
    calcularValorInicialRestanteIngresos(nodo) {
        nodo.data.cantidadUP = nodo.children.reduce((acumulador, child) => { return acumulador + child.data.cantidadUP }, 0);
        if (nodo.children && nodo.children.length > 0) {
            let sumIngresoValorInicialProductoSC = 0;
            let sumIngresoValorInicialAdicional = 0;
            let sumIngresoValorRestanteProductoSC = 0;
            let sumIngresoValorRestanteAdicional = 0;

            let nodoIngresoSC = nodo.children.find(child => child.data.codItem === FlujoCajaItemConstants.FlujoProyecto_IngresosAgropecuarios_ProductoSC);
            sumIngresoValorInicialProductoSC = nodoIngresoSC ? ((nodoIngresoSC.data.valorInicial / 100) * this.calcularIngresoProductoSC(nodoIngresoSC.data.cantidadUP)) : 0;
            sumIngresoValorRestanteProductoSC = nodoIngresoSC ? ((nodoIngresoSC.data.valorRestante / 100) * this.calcularIngresoProductoSC(nodoIngresoSC.data.cantidadUP)) : 0;

            sumIngresoValorInicialAdicional = nodo.children.filter(child => child.data.codItem != FlujoCajaItemConstants.FlujoProyecto_IngresosAgropecuarios_ProductoSC)
                .reduce((acumulador, child) => { return acumulador + ((child.data.valorInicial / 100) * this.calcularIngresoProductoAdicionalSC(child.data.descripcion, child.data.cantidadUP)); }, 0);
            sumIngresoValorRestanteAdicional = nodo.children.filter(child => child.data.codItem != FlujoCajaItemConstants.FlujoProyecto_IngresosAgropecuarios_ProductoSC)
                .reduce((acumulador, child) => { return acumulador + ((child.data.valorRestante / 100) * this.calcularIngresoProductoAdicionalSC(child.data.descripcion, child.data.cantidadUP)); }, 0);

            nodo.data.valorInicial = sumIngresoValorInicialProductoSC + sumIngresoValorInicialAdicional;
            nodo.data.valorRestante = sumIngresoValorRestanteProductoSC + sumIngresoValorRestanteAdicional;
        }
    }
    calcularValorInicialRestanteEgresos(nodo) {
        nodo.data.cantidadUP = nodo.children.reduce((acumulador, child) => { return acumulador + child.data.cantidadUP }, 0);
        if (nodo.children && nodo.children.length > 0) {
            let sumEgresoValorInicialProductoSC = 0;
            let sumEgresoValorInicialAdicional = 0;
            let sumEgresoValorRestanteProductoSC = 0;
            let sumEgresoValorRestanteAdicional = 0;

            let nodoEgresoSC = nodo.children.find(child => child.data.codItem === FlujoCajaItemConstants.FlujoProyecto_EgresosAgropecuarios_ProductoSC);
            sumEgresoValorInicialProductoSC = nodoEgresoSC ? ((nodoEgresoSC.data.valorInicial / 100) * this.calcularEgresoProductoSC(nodoEgresoSC.data.cantidadUP)) : 0;
            sumEgresoValorRestanteProductoSC = nodoEgresoSC ? ((nodoEgresoSC.data.valorRestante / 100) * this.calcularEgresoProductoSC(nodoEgresoSC.data.cantidadUP)) : 0;

            sumEgresoValorInicialAdicional = nodo.children.filter(child => child.data.codItem != FlujoCajaItemConstants.FlujoProyecto_EgresosAgropecuarios_ProductoSC)
                .reduce((acumulador, child) => { return acumulador + ((child.data.valorInicial / 100) * this.calcularEgresoProductoAdicionalSC(child.data.descripcion, child.data.cantidadUP)); }, 0);
            sumEgresoValorRestanteAdicional = nodo.children.filter(child => child.data.codItem != FlujoCajaItemConstants.FlujoProyecto_EgresosAgropecuarios_ProductoSC)
                .reduce((acumulador, child) => { return acumulador + ((child.data.valorRestante / 100) * this.calcularEgresoProductoAdicionalSC(child.data.descripcion, child.data.cantidadUP)); }, 0);

            nodo.data.valorInicial = (sumEgresoValorInicialProductoSC + sumEgresoValorInicialAdicional) * (sumEgresoValorInicialProductoSC + sumEgresoValorInicialAdicional > 0 ? -1 : 1);
            nodo.data.valorRestante = (sumEgresoValorRestanteProductoSC + sumEgresoValorRestanteAdicional) * (sumEgresoValorRestanteProductoSC + sumEgresoValorRestanteAdicional > 0 ? -1 : 1);
        }
    }
    calcularValorInicialRestanteFlujoProyecto(nodo) {
        if (nodo.children && nodo.children.length > 0) {
            let sumatoriaValorInicial = nodo.children.reduce((acumulador, child) => {
                return acumulador + child.data.valorInicial;
            }, 0);
            let sumatoriaValorRestante = nodo.children.reduce((acumulador, child) => {
                return acumulador + child.data.valorRestante;
            }, 0);
            nodo.data.valorInicial = sumatoriaValorInicial;
            nodo.data.valorRestante = sumatoriaValorRestante;
        }
    }
    //#endregion

    //#region [ FCD001 - MontosPlazo ]
    calcularIngresosAgropecuariosMontosPlazo() {
        let flujoProyecto = this.obtenerNodo(FlujoCajaItemConstants.FlujoProyecto);
        if (flujoProyecto) {
            if (flujoProyecto.children && flujoProyecto.children.length > 0) {
                let nodo = this.obtenerNodoHijo(FlujoCajaItemConstants.FlujoProyecto, FlujoCajaItemConstants.FlujoProyecto_IngresosAgropecuarios);
                this.periodos.forEach(periodo => {
                    let sumIngresoProductoSC = 0;
                    let sumIngresoProductoAdicional = 0;
                    let nodoMes = nodo.data.montosPlazo.find(mp => (mp.anio === periodo.anio && mp.mes === periodo.mes));
                    if (nodoMes) {
                        let ingresoProductoSC = nodo.children.find(child => child.data.codItem === FlujoCajaItemConstants.FlujoProyecto_IngresosAgropecuarios_ProductoSC);
                        if (ingresoProductoSC) {
                            let nodoIngresoMes = ingresoProductoSC.data.montosPlazo.find(montoMes => (montoMes.anio === periodo.anio && montoMes.mes === periodo.mes));
                            sumIngresoProductoSC = ((nodoIngresoMes.monto / 100) * this.calcularIngresoProductoSC(ingresoProductoSC.data.cantidadUP));
                        }
                        let ingresoAdicionales = nodo.children.filter(child => child.data.codItem != FlujoCajaItemConstants.FlujoProyecto_IngresosAgropecuarios_ProductoSC);
                        if (ingresoAdicionales && ingresoAdicionales.length > 0) {
                            sumIngresoProductoAdicional = ingresoAdicionales.reduce((acumulador, child) => {
                                let mesMonto = child.data.montosPlazo.find(montoMes => (montoMes.anio === periodo.anio && montoMes.mes === periodo.mes));
                                return acumulador + (mesMonto ? ((mesMonto.monto / 100) * this.calcularIngresoProductoAdicionalSC(child.data.descripcion, child.data.cantidadUP)) : 0);
                            }, 0);
                        }
                        nodoMes.monto = sumIngresoProductoSC + sumIngresoProductoAdicional;
                    }
                });
            }
        }
    }
    calcularEgresosAgropecuariosMontosPlazo() {
        let flujoProyecto = this.obtenerNodo(FlujoCajaItemConstants.FlujoProyecto);
        if (flujoProyecto) {
            if (flujoProyecto.children && flujoProyecto.children.length > 0) {
                let nodo = this.obtenerNodoHijo(FlujoCajaItemConstants.FlujoProyecto, FlujoCajaItemConstants.FlujoProyecto_EgresosAgropecuarios);
                this.periodos.forEach(periodo => {
                    let sumEgresoProductoSC = 0;
                    let sumEgresoProductoAdicional = 0;
                    let nodoMes = nodo.data.montosPlazo.find(mp => (mp.anio === periodo.anio && mp.mes === periodo.mes));
                    if (nodoMes) {
                        let egresoProductoSC = nodo.children.find(child => child.data.codItem === FlujoCajaItemConstants.FlujoProyecto_EgresosAgropecuarios_ProductoSC);
                        if (egresoProductoSC) {
                            let nodoIngresoMes = egresoProductoSC.data.montosPlazo.find(montoMes => (montoMes.anio === periodo.anio && montoMes.mes === periodo.mes));
                            sumEgresoProductoSC = ((nodoIngresoMes.monto / 100) * this.calcularEgresoProductoSC(egresoProductoSC.data.cantidadUP));
                        }
                        let egresoAdicionales = nodo.children.filter(child => child.data.codItem != FlujoCajaItemConstants.FlujoProyecto_EgresosAgropecuarios_ProductoSC);
                        if (egresoAdicionales && egresoAdicionales.length > 0) {
                            sumEgresoProductoAdicional = egresoAdicionales.reduce((acumulador, child) => {
                                let mesMonto = child.data.montosPlazo.find(montoMes => (montoMes.anio === periodo.anio && montoMes.mes === periodo.mes));
                                return acumulador + (mesMonto ? ((mesMonto.monto / 100) * this.calcularEgresoProductoAdicionalSC(child.data.descripcion, child.data.cantidadUP)) : 0);
                            }, 0);
                        }
                        nodoMes.monto = (sumEgresoProductoSC + sumEgresoProductoAdicional) * (sumEgresoProductoSC + sumEgresoProductoAdicional > 0 ? -1 : 1);
                    }
                });
            }
        }
    }
    //#endregion

    //#region [ Calcular Montos ]

    calcularNodoValorInicial(nodo) {
        if (nodo.children.length === 0) {
            return nodo.data.valorInicial;
        }
        const sumaHijos = nodo.children.reduce((acumulador, child) => {
            return acumulador + this.calcularNodoValorInicial(child);
        }, 0);
        nodo.data.valorInicial = sumaHijos;
        return nodo.data.valorInicial;
    }

    calcularNodoValorRestante(nodo) {
        if (nodo.children.length === 0) {
            return nodo.data.valorRestante;
        }
        const sumValorRestante = nodo.children.reduce((acumulador, child) => {
            return acumulador + this.calcularNodoValorRestante(child);
        }, 0);
        nodo.data.valorRestante = sumValorRestante;
        return nodo.data.valorRestante;
    }

    calcularFCD001() {
        let flujoProyecto = this.obtenerNodo(FlujoCajaItemConstants.FlujoProyecto);
        if (flujoProyecto) {
            let FCD002 = this.obtenerNodoHijo(FlujoCajaItemConstants.FlujoProyecto, FlujoCajaItemConstants.FlujoProyecto_IngresosAgropecuarios);
            if (FCD002) { this.calcularValorInicialRestanteIngresos(FCD002); }
            let FCD003 = this.obtenerNodoHijo(FlujoCajaItemConstants.FlujoProyecto, FlujoCajaItemConstants.FlujoProyecto_EgresosAgropecuarios);
            if (FCD003) { this.calcularValorInicialRestanteEgresos(FCD003); }

            for (let index = 0; index < FCD003.children.length; index++) {
                const chilFCDd003 = FCD003.children[index];
                const chilFCDd002 = FCD002.children[index];
                chilFCDd003.data.cantidadUP = chilFCDd002.data.cantidadUP;
            }

            this.calcularValorInicialRestanteFlujoProyecto(flujoProyecto);

            this.calcularIngresosAgropecuariosMontosPlazo();
            this.calcularEgresosAgropecuariosMontosPlazo();

            this.periodos.forEach(periodo => {
                let montoMes = flujoProyecto.data.montosPlazo.find(mp => (mp.anio === periodo.anio && mp.mes === periodo.mes));
                const sumaMonto = flujoProyecto.children.reduce((acumulador, element) => {
                    let item = element.data.montosPlazo.find(montoMes => (montoMes.anio === periodo.anio && montoMes.mes === periodo.mes));
                    return acumulador + item.monto;
                }, 0)
                montoMes.monto = sumaMonto;
            });

            flujoProyecto.data.total = flujoProyecto.data.montosPlazo.reduce((acumulador, item) => { return acumulador + item.monto }, 0);
            let total_FCD002 = this.obtenerNodoHijo(FlujoCajaItemConstants.FlujoProyecto, FlujoCajaItemConstants.FlujoProyecto_IngresosAgropecuarios);
            if (total_FCD002) {
                total_FCD002.data.total = total_FCD002.data.montosPlazo.reduce((acumulador, item) => { return acumulador + item.monto }, 0);
                if (total_FCD002.children && total_FCD002.children.length > 0) {
                    total_FCD002.children.forEach(child => {
                        child.data.total = child.data.valorInicial
                            + child.data.montosPlazo.reduce((acc, item) => { return acc + item.monto }, 0)
                            + child.data.valorRestante
                    });
                }
            }
            let total_FCD003 = flujoProyecto.children.find(child => child.data.codItem === FlujoCajaItemConstants.FlujoProyecto_EgresosAgropecuarios);
            if (total_FCD003) {
                total_FCD003.data.total = total_FCD003.data.montosPlazo.reduce((acumulador, item) => { return acumulador + item.monto }, 0);
                if (total_FCD003.children && total_FCD003.children.length > 0) {
                    total_FCD003.children.forEach(child => {
                        child.data.total = child.data.valorInicial
                            + child.data.montosPlazo.reduce((acc, item) => { return acc + item.monto }, 0)
                            + child.data.valorRestante
                    });
                }
            }

        }
    }

    calcularFCD004() {
        let nodoFlujoOtrasActividades = this.obtenerNodo(FlujoCajaItemConstants.FlujoOtrasActividades);
        if (nodoFlujoOtrasActividades) {
            if (nodoFlujoOtrasActividades.children && nodoFlujoOtrasActividades.children.length > 0) {
                nodoFlujoOtrasActividades.children.forEach(child => {
                    if (child.data.codItem != 'FCD007') {
                        child.data.valorInicial = 0;
                        child.data.valorInicial = this.calcularNodoValorInicial(child);

                        child.data.valorRestante = 0;
                        child.data.valorRestante = this.calcularNodoValorRestante(child)
                    }
                    if (child.data.codItem == 'FCD006') {
                        child.children.forEach(childEgresos => {
                            if (childEgresos.data.valorInicial > 0) {
                                childEgresos.data.valorInicial = childEgresos.data.valorInicial * (-1);
                            }
                            if (childEgresos.data.valorRestante > 0) {
                                childEgresos.data.valorRestante = childEgresos.data.valorRestante * (-1);
                            }
                            childEgresos.data.montosPlazo.forEach(childEgresosMonto => {
                                if (childEgresosMonto.monto > 0) {
                                    childEgresosMonto.monto = childEgresosMonto.monto * (-1);
                                }
                            });
                        });
                    }
                });
            }
            nodoFlujoOtrasActividades.data.valorInicial = this.calcularNodoValorInicial(nodoFlujoOtrasActividades);
            nodoFlujoOtrasActividades.data.valorRestante = this.calcularNodoValorRestante(nodoFlujoOtrasActividades);
            this.calcularMontosPlazoFCD004(nodoFlujoOtrasActividades);
            let totalFlujoOtrasActividades = nodoFlujoOtrasActividades.data.montosPlazo.reduce((acumulador, item) => { return acumulador + item.monto }, 0);

            nodoFlujoOtrasActividades.data.total = totalFlujoOtrasActividades == null ? 0 : totalFlujoOtrasActividades;
            if (nodoFlujoOtrasActividades.children && nodoFlujoOtrasActividades.children.length > 0) {
                nodoFlujoOtrasActividades.children.forEach(child => {
                    let childTotal = child.data.montosPlazo.reduce((acumulador, item) => { return acumulador + item.monto }, 0);
                    child.data.total = childTotal == null ? 0 : childTotal;
                    if (child.children && child.children.length > 0) {
                        child.children.forEach(child => {
                            let childChildTotal = child.data.montosPlazo.reduce((acumulador, item) => { return acumulador + item.monto }, 0)
                            child.data.total = childChildTotal == null ? 0 : childChildTotal;
                        });
                    }
                });
            }
        }
    }

    calcularMontosPlazoFCD004(nodoFlujoOtrasActividades) {
        //CALCULO DE MONTOS PLAZO - CHILDREN
        if (nodoFlujoOtrasActividades) {
            nodoFlujoOtrasActividades.children.forEach(child => {
                if (child.data.codItem != 'FCD007') {
                    this.periodos.forEach(periodo => {
                        let montoMes = child.data.montosPlazo.find(montMes => (montMes.anio === periodo.anio && montMes.mes === periodo.mes));
                        const sumMontoMes = child.children.reduce((acumulador, element) => {
                            let item = element.data.montosPlazo.find(montoMes => (montoMes.anio === periodo.anio && montoMes.mes === periodo.mes));
                            if (item != undefined) {
                                return acumulador + this.isNaNMonto(item.monto);
                            } else {
                                return 0;
                            }
                        }, 0);
                        montoMes.monto = sumMontoMes;
                    });
                }
            });
            //CALCULO MONTOS PLAZO - PARENT
            this.periodos.forEach(periodo => {
                let montoMes = nodoFlujoOtrasActividades.data.montosPlazo.find(mp => (mp.anio === periodo.anio && mp.mes === periodo.mes));
                const sumaMonto = nodoFlujoOtrasActividades.children.reduce((acumulador, element) => {
                    let item = element.data.montosPlazo.find(montoMes => (montoMes.anio === periodo.anio && montoMes.mes === periodo.mes));
                    return acumulador + this.isNaNMonto(item.monto);
                }, 0)
                montoMes.monto = sumaMonto;
            });
        }
    }

    async calcularFCD008() {

        let egresosFinancieros = this.obtenerNodo(FlujoCajaItemConstants.EgresosFinancieros);
        if (egresosFinancieros) {
            egresosFinancieros.data.valorInicial = this.calcularNodoValorInicial(egresosFinancieros);
            await this.calcularMontosFCD008(egresosFinancieros);

            egresosFinancieros.data.valorRestante = this.calcularNodoValorRestante(egresosFinancieros);

            let sumaDPD: Number = await this.SumatoriaCuotaPotencialDirecta();
            let sumaDPI: Number = await this.SumatoriaCuotaPotencialIndirecta();

            if (sumaDPD || sumaDPI) {
                egresosFinancieros.children.forEach(child => {
                    if (child.data.codItem == 'FCD009') {

                        child.data.montosPlazo.forEach(childMonto => {
                            childMonto.monto = parseFloat(sumaDPD.toFixed(2));
                        })
                    }
                    if (child.data.codItem == 'FCD010') {

                        child.data.montosPlazo.forEach(childMonto => {
                            childMonto.monto = parseFloat(sumaDPI.toFixed(2));
                        })
                    }
                });
            }


            let total = egresosFinancieros.data.montosPlazo.reduce((acumulador, item) => { return acumulador + item.monto }, 0);

            egresosFinancieros.data.total = total == null ? 0 : total;

            egresosFinancieros.children.forEach(child => {

                let childTotal = child.data.montosPlazo.reduce((acumulador, item) => { return acumulador + item.monto }, 0)

                child.data.total = childTotal == null ? 0 : parseFloat(childTotal.toFixed(2));
            });

            await this.calcularFCD011();

        }
    }

    async calcularMontosFCD008(egresosFinancieros) {
        await egresosFinancieros.children.forEach(child => {
            child.data.montosPlazo.forEach(childEgresos => {
                if (childEgresos.monto > 0) {
                    childEgresos.monto = childEgresos.monto * (-1);
                }
            })
        });

        this.periodos.forEach(periodo => {
            let montoMes = egresosFinancieros.data.montosPlazo.find(mp => (mp.anio === periodo.anio && mp.mes === periodo.mes));
            const sumaMonto = egresosFinancieros.children.reduce((acumulador, element) => {
                let item = element.data.montosPlazo.find(montoMes => (montoMes.anio === periodo.anio && montoMes.mes === periodo.mes));
                item.monto = (item.monto == null || item.monto == undefined) ? 0 : item.monto
                return acumulador + item.monto;
            }, 0)
            montoMes.monto = sumaMonto;
        });
    }

    calcularFCD011() {
        let nodos = this.data.filter(nodo => (nodo.data.codItem === FlujoCajaItemConstants.FlujoProyecto || nodo.data.codItem === FlujoCajaItemConstants.FlujoOtrasActividades || nodo.data.codItem === FlujoCajaItemConstants.EgresosFinancieros));
        let ExcedenteMensual = this.obtenerNodo(FlujoCajaItemConstants.ExcedenteMensual);
        if (ExcedenteMensual) {
            ExcedenteMensual.data.valorInicial = nodos.reduce((acumulador, nodo) => { return acumulador + nodo.data.valorInicial }, 0);
            this.periodos.forEach(periodo => {
                let montoMes = ExcedenteMensual.data.montosPlazo.find(mp => (mp.anio === periodo.anio && mp.mes === periodo.mes));
                const sumaMonto = nodos.reduce((acumulador, nodo) => {
                    let item = nodo.data.montosPlazo.find(montoMes => (montoMes.anio === periodo.anio && montoMes.mes === periodo.mes));
                    return acumulador + item.monto;
                }, 0)
                montoMes.monto = sumaMonto;
            });
            ExcedenteMensual.data.valorRestante = nodos.reduce((acumulador, nodo) => { return acumulador + nodo.data.valorRestante }, 0);
            ExcedenteMensual.data.total = nodos.reduce((acumulador, nodo) => { return acumulador + nodo.data.total }, 0);
        }
    }

    calcularFCD012() {
        /*let cuotasAmortizaciones = this.obtenerNodoHijo(FlujoCajaItemConstants.FlujoFinanciero, FlujoCajaItemConstants.FlujoFinanciero_CuotasAmortizaciones);
       
        if (cuotasAmortizaciones) {
            let totalCuotasPropuestasCredito = cuotasAmortizaciones.data.montosPlazo.reduce((acumulador, item) => { return acumulador + item.monto }, 0);;
            this.rseSvc.Set_Criterio2_TCA(totalCuotasPropuestasCredito);
        }*/
        let rse = this.rseSvc.calcularRSE();
        this.store.dispatch(FlujoCajaRSEActions.setRSE({ rse: rse }));

        let flujoFinanciero = this.obtenerNodo(FlujoCajaItemConstants.FlujoFinanciero);
        if (flujoFinanciero) {
            /*if (flujoFinanciero.children && flujoFinanciero.children.length > 0) {
                let nodoDisponibleAporteSaldo = this.obtenerNodoHijo(FlujoCajaItemConstants.FlujoFinanciero, FlujoCajaItemConstants.FlujoFinanciero_DisponibleAporteSaldoCaja);
                if (nodoDisponibleAporteSaldo) {
                    //nodoDisponibleAporteSaldo.data.valorInicial = +this.montoESFA;
                }
            }*/
            flujoFinanciero.data.valorInicial = this.calcularNodoValorInicial(flujoFinanciero);
            this.calcularMontosFCD012(flujoFinanciero);
            flujoFinanciero.data.valorRestante = this.calcularNodoValorRestante(flujoFinanciero);
            let total = flujoFinanciero.data.montosPlazo.reduce((acumulador, item) => { return item.monto }, 0);
            flujoFinanciero.data.total = total == null ? 0 : total;
            flujoFinanciero.children.forEach(child => {
                let childTotal = child.data.montosPlazo.reduce((acc, item) => { return item.monto }, 0)
                child.data.total = childTotal == null ? 0 : childTotal;
            }); //
            this.calcularFCD016();
        }
    }

    calcularMontosFCD012(flujoFinanciero) {
        this.periodos.forEach(periodo => {
            let montoMes = flujoFinanciero.data.montosPlazo.find(mp => (mp.anio === periodo.anio && mp.mes === periodo.mes));
            const sumaMonto = flujoFinanciero.children.reduce((acumulador, element) => {
                let item = element.data.montosPlazo.find(montoMes => (montoMes.anio === periodo.anio && montoMes.mes === periodo.mes));
                return acumulador + item.monto;
            }, 0)
            montoMes.monto = sumaMonto;
        });
    }

    calcularFCD016() {
        let ExcedenteFinal = this.obtenerNodo('FCD016');
        let FlujoFinanciero = this.obtenerNodo(FlujoCajaItemConstants.FlujoFinanciero);
        if (ExcedenteFinal && FlujoFinanciero) {
            let DisponibleAporteSaldoCaja = this.obtenerNodoHijo(FlujoCajaItemConstants.FlujoFinanciero, FlujoCajaItemConstants.FlujoFinanciero_DisponibleAporteSaldoCaja);
            let MontoCredito = this.obtenerNodoHijo(FlujoCajaItemConstants.FlujoFinanciero, FlujoCajaItemConstants.FlujoFinanciero_MontoCredito);
            if (DisponibleAporteSaldoCaja && MontoCredito) {
                let valorDisponibleAporteSaldo = DisponibleAporteSaldoCaja.data.valorInicial;
                let valorMontoCredito = MontoCredito.data.valorInicial;
                ExcedenteFinal.data.valorInicial = +valorDisponibleAporteSaldo + +valorMontoCredito;
            }
            this.calcularMontosFCD016(ExcedenteFinal)
        };
    }

    calcularMontosFCD016(ExcedenteFinal) {
        let ExcedenteMensual = this.obtenerNodo(FlujoCajaItemConstants.ExcedenteMensual);
        let FlujoFinanciero = this.obtenerNodo(FlujoCajaItemConstants.FlujoFinanciero);
        let index = 0;
        this.periodos.forEach(periodo => {
            let ExcedenteFinalMesActual = ExcedenteFinal.data.montosPlazo[index];//.find(mp => (mp.anio === periodo.anio && mp.mes === periodo.mes));
            let ExcedenteMensualMesActual = ExcedenteMensual.data.montosPlazo[index];//.find(mp => (mp.anio === periodo.anio && mp.mes === periodo.mes));
            let FlujoFinancieroMesActual = FlujoFinanciero.data.montosPlazo[index];//.find(mp => (mp.anio === periodo.anio && mp.mes === periodo.mes));
            let ExcedenteFinalMesAnterior;
            if (index == 0) {
                ExcedenteFinalMesAnterior = ExcedenteFinal.data.valorInicial;
            } else {
                ExcedenteFinal.data.montosPlazo.forEach(element => {
                    if (Number.isNaN(element.monto)) {
                        element.monto = 0;
                    }
                });
                let excedenteAnterior = ExcedenteFinal.data.montosPlazo[index - 1];//.find(mp => (mp.anio === periodo.anio && mp.mes === periodo.mes - 1));
                if (excedenteAnterior) {
                    ExcedenteFinalMesAnterior = excedenteAnterior.monto;
                }
            }
            index = index + 1;
            ExcedenteFinalMesActual.monto = ExcedenteMensualMesActual.monto + FlujoFinancieroMesActual.monto + ExcedenteFinalMesAnterior;
        });
        if (ExcedenteMensual && FlujoFinanciero && (index > 1)) {
            ExcedenteFinal.data.total = ExcedenteMensual.data.total + FlujoFinanciero.data.total + ExcedenteFinal.data.montosPlazo[index - 1].monto;
        }
    }

    //#region [ Calcular Flujo de Proyecto / FCD001 ]

    //#region [ Ingresos Agropecuarios / FCD002 ]
    //#region [ Sumatoria Ingresos Agropecuarios ]
    /**
     * @param ITPSC - Ingreso Total de Producto de la SC
     * @param ITPA - Ingreso Total de Producto Adicional
     */
    FormulaIngresosAgropecuarios(ITPSC: number, ITPA: number) {
        const resultado = ITPSC + ITPA;
        return resultado;
    }
    //#endregion

    //#region [ Ingreso Producto SC ]
    private calcularIngresoProductoSC(_CUF: number)
        : number {
        const R = this.solicitud.hpRendimiento;
        const VR = this.flujoCaja.svRendimiento;
        const VP = this.flujoCaja.svPrecio;
        const CUF = _CUF;
        const P = this.solicitud.hpPrecio;
        const resultado = this.FormulaIngresoProductoSC(R, VR, VP, CUF, P);
        return resultado;
    }

    FormulaIngresoProductoSC(R: number, VR: number, VP: number, CUF: number, P: number): number {
        const resultado = ((R + (VR / 100) * R) * CUF * (P + (VP / 100) * P));
        return resultado;
    }
    //#endregion

    //#region [ Ingreso Producto Adicional SC ]
    private calcularIngresoProductoAdicionalSC(CodhpAdicional: string, _CUF: number)
        : number {
        let itemHP = this.datosHojaProducto ? this.datosHojaProducto.find(mp => (mp.codigoHP == CodhpAdicional)) : null;
        const R = itemHP ? itemHP.rendimiento : 0;//this.flujoCaja.hpRendimiento;
        const CUF = _CUF;
        const P = itemHP ? itemHP.precio : 0;//this.flujoCaja.hpPrecio;
        const resultado = this.FormulaIngresoProductoAdicionalSC(R, CUF, P);
        return resultado;
    }

    FormulaIngresoProductoAdicionalSC(R: number, CUF: number, P: number): number {
        const resultado = R * CUF * P;
        return resultado;
    }
    //#endregion
    //#endregion

    //#region [ Egresos Agropecuarios / FCD003 ]
    //#region [ Sumatoria Egresos Agropecuarios ]

    /**
     * @param ITPSC - Egreso Total de Producto de la SC
     * @param ITPA - Egreso Total de Producto Adicional
     */
    FormulaEgresosAgropecuarios(ETPSC: number, ETPA: number) {
        const resultado = ETPSC + ETPA;
        return resultado;
    }
    //#endregion

    //#region [ Egreso Producto SC ]
    private calcularEgresoProductoSC(_CUF: number)
        : number {
        const C = this.solicitud.hpCosto;
        const VC = this.flujoCaja.svCosto;
        const CUF = _CUF;
        const resultado = this.FormulaEgresoProductoSC(C, VC, CUF);
        return resultado;
    }

    FormulaEgresoProductoSC(C: number, VC: number, CUF: number): number {
        const resultado = (C + (VC / 100) * C) * CUF;
        return resultado;
    }
    //#endregion

    //#region [ Egreso Producto Adicional SC ]
    private calcularEgresoProductoAdicionalSC(CodhpAdicional: string, _CUF: number)
        : number {
        let itemHP = this.datosHojaProducto ? this.datosHojaProducto.find(mp => (mp.codigoHP == CodhpAdicional)) : null;

        const C = itemHP ? itemHP.costo : 0;//this.flujoCaja.hpCosto;
        const CUF = _CUF;
        const resultado = this.FormulaEgresoProductoAdicionalSC(C, CUF);
        return resultado;
    }

    FormulaEgresoProductoAdicionalSC(C: number, CUF: number): number {
        const resultado = C * CUF;
        return resultado;
    }
    //#endregion
    //#endregion
    //#endregion

    isNaNMonto(monto: number) {
        if (isNaN(monto)) {
            return 0
        } else {
            return monto
        }
    }


    /*DEUDA POTENCIAL DIRECTA*/
    async SumatoriaCuotaPotencialDirecta(): Promise<number> {
        var cuotaPotencialDirecta = 0;
        await this.parametrosVersionFC.parametrosDPD.forEach((item) => {
            if (this.flujoCaja.deudaPD) {
                let dpdItem: FlujoCajaDPD = this.flujoCaja.deudaPD.find(dpd => dpd.idParametroDpd == item.idParametroDPD.trim());
                if (dpdItem) {
                    item['valor'] = dpdItem.montoDeuda;
                } else {
                    item['valor'] = 0;
                }
                item['factorConversion'] = item['factorConversion'] ?? 0;
                item['tem'] = item['tem'] ?? 0;
                item['plazo'] = item['plazo'] ?? 0;
                cuotaPotencialDirecta = cuotaPotencialDirecta +
                    this.calcularCuotaPotencialDirecta(item['valor'], item['factorConversion'], item['tem'], item['plazo']);
            }
        });
        return cuotaPotencialDirecta;
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

    /*deuda potencial indirecta */



    async SumatoriaCuotaPotencialIndirecta(): Promise<number> {

        var cuotaPotencialIndirecta = 0;
        await this.parametrosVersionFC.parametrosDPI.forEach((item) => {

            if (this.flujoCaja.deudaPI && this.flujoCaja.deudaPI.length > 0) {
                let dpiItem: FlujoCajaDPI = this.flujoCaja.deudaPI.find(dpd => dpd.idParametroDpi == item.idParametroDPI.trim());
                if (dpiItem) {
                    item['valor'] = dpiItem.montoDeuda;
                } else {
                    item['valor'] = 0;
                }
                item['factorConversion'] = item['factorCalificacion' + this.hash.get(dpiItem.calificacion)] ?? 0;
                item['tem'] = item['tem'] ?? 0;
                item['plazo'] = item['plazo'] ?? 0;
                cuotaPotencialIndirecta = cuotaPotencialIndirecta +
                    this.calcularCuotaPotencialIndirecta(item['valor'], item['factorConversion'], item['tem'], item['plazo']);
            }
        });

        return cuotaPotencialIndirecta;
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
