import { Injectable } from '@angular/core';
import { ERAConstants } from 'src/app/shared/common/era.constants';
import { SharedService } from './shared.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import * as SharedActions from 'src/app/redux/actions/shared/shared.actions';
import { FlujoCaja } from 'src/app/models/flujocaja.interface';

@Injectable({
    providedIn: 'root'
})
export class SharedERAService {

    constructor(private sharedSvc: SharedService
        , private store: Store<AppState>) { }

    private data: any[] = [];
    private listData: any;
    private flujoCaja: FlujoCaja;

    setData(eraTree: any[], flujoCaja: FlujoCaja) {
        this.data = eraTree;
        this.flujoCaja = flujoCaja;
    }

    getData() {
        return this.data;
    }

    getDesembolsoAnterior() {
        return this.flujoCaja
    }

    calcularERA() {
        this.calcularSegundaColumna();
        this.calcularCuartaQuintaColumna();
        this.isCompletedERA();
    }

    calcularDatosEra() {
        this.calcularERA();
        return this.data;
    }

    private calcularMontoActual(nodo): void {
        if (nodo) {

            if (nodo.children.length > 0) {
                if (nodo.data.codItem == 'ERA001') {
                    let sumPecuario = 0;
                    let sumAgricola = 0;
                    let ERA002 = this.obtenerNodoHijo(ERAConstants.VentasNetas, ERAConstants.VentasNetas_Agricola);
                    let ERA003 = this.obtenerNodoHijo(ERAConstants.VentasNetas, ERAConstants.VentasNetas_Pecuario);

                    sumAgricola = ERA002.children.reduce((acumulador, child) => {
                        return acumulador + child.data.montoActual;
                    }, 0);
                    ERA002.data.montoActual = sumAgricola;

                    sumPecuario = ERA003.children.reduce((acumulador, child) => {
                        return acumulador + child.data.montoActual;
                    }, 0);
                    ERA003.data.montoActual = sumPecuario;

                    nodo.data.montoActual = sumPecuario + sumAgricola;
                } else if (nodo.data.codItem == 'ERA004') {
                    let sumPecuario = 0;
                    let sumAgricola = 0;
                    let ERA005 = this.obtenerNodoHijo(ERAConstants.CostosVentas, ERAConstants.CostosVentas_Agricola);
                    let ERA006 = this.obtenerNodoHijo(ERAConstants.CostosVentas, ERAConstants.CostosVentas_Pecuario);

                    sumAgricola = ERA005.children.reduce((acumulador, child) => {
                        return acumulador + child.data.montoActual;
                    }, 0);
                    ERA005.data.montoActual = sumAgricola;
                    sumPecuario = ERA006.children.reduce((acumulador, child) => {
                        return acumulador + child.data.montoActual;
                    }, 0);
                    ERA006.data.montoActual = sumPecuario;
                    nodo.data.montoActual = sumPecuario + sumAgricola;
                } else if (nodo.data.codItem == 'ERA013') {
                    let sumOtrosIng = 0;

                    sumOtrosIng = nodo.children.reduce((acumulador, child) => {
                        return acumulador + child.data.montoActual;
                    }, 0);

                    nodo.data.montoActual = sumOtrosIng;
                }

            } else {
                nodo.data.montoActual = 0;
            }
        }

        /*if (nodo) {
            if (nodo.children.length === 0) {
                return 0
            } else {
                const sumaChildren = nodo.children.reduce((acumulador, child) => {
                    return acumulador + this.calcularMontoActual(child);
                }, 0);
                nodo.data.montoActual = sumaChildren;
                return nodo.data.montoActual;
            }
        }*/
    }

    obtenerNodo(codItem: string) {
        let nodo = this.data.find(nodo => nodo.data.codItem === codItem);
        if (nodo) {
            if (nodo.data.montosPlazo === null) {
                if (nodo.children && nodo.children.length > 0) {
                    nodo.children.forEach(child => {
                        if (child) {
                            if (child.data.montosPlazo === null)
                                child.data.montosPlazo = []
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

    private calcularSegundaColumna() {
        let ERA001 = this.obtenerNodo(ERAConstants.VentasNetas);
        this.calcularMontoActual(ERA001);

        let ERA004 = this.obtenerNodo(ERAConstants.CostosVentas);
        this.calcularMontoActual(ERA004);

        let ERA007 = this.obtenerNodo(ERAConstants.UtilidadBruta);
        if (ERA007) { ERA007.data.montoActual = (ERA001 ? ERA001.data.montoActual : 0) - (ERA004 ? ERA004.data.montoActual : 0); }

        let ERA008 = this.obtenerNodoHijo(ERAConstants.UtilidadBruta, ERAConstants.UtilidadBruta_OtrosGastosVentaAdministracion);

        let ERA009 = this.obtenerNodo(ERAConstants.UtilidadOperativa);
        if (ERA007 && ERA008 && ERA009)
            ERA009.data.montoActual = (ERA007 ? ERA007.data.montoActual : 0) - (ERA008 ? ERA008.data.montoActual : 0);

        let ERA010 = this.obtenerNodoHijo(ERAConstants.UtilidadOperativa, ERAConstants.UtilidadOperativa_GastosFinancieros_InteresCdts);
        let ERA011 = this.obtenerNodoHijo(ERAConstants.UtilidadOperativa, ERAConstants.UtilidadOperativa_IngresosFinancieros);

        let ERA012 = this.obtenerNodo(ERAConstants.UtilidadNeta);
        if (ERA012 && ERA009 && ERA010 && ERA011) {
            ERA012.data.montoActual = (ERA009 ? ERA009.data.montoActual : 0)
                + (ERA011 ? ERA011.data.montoActual : 0)
                - (ERA010 ? ERA010.data.montoActual : 0);
        }

        let ERA013 = this.obtenerNodoHijo(ERAConstants.UtilidadNeta, ERAConstants.UtilidadNeta_OtrosIngresos_NoAgropecuarios);
        if (ERA013) { this.calcularMontoActual(ERA013); }

        let ERA014 = this.obtenerNodoHijo(ERAConstants.UtilidadNeta, ERAConstants.UtilidadNeta_GastosFamiliares);
        if (ERA014)
            ERA014.data.montoActual = (ERA014.data.montoActual <= 0) ? ERA014.data.montoActual : ERA014.data.montoActual * (-1)

        let ERA015 = this.obtenerNodo(ERAConstants.ExcedenteNetoEjercicio);

        if (ERA012 && ERA013 && ERA014 && ERA015) {
            ERA015.data.montoActual = ((ERA012 ? ERA012.data.montoActual : 0)
                + (ERA013 ? ERA013.data.montoActual : 0))
                + (ERA014 ? ERA014.data.montoActual : 0);
        }
    }

    private calcularPorcentajeAV(nodo) {
        let ERA001 = this.obtenerNodo(ERAConstants.VentasNetas);
        if (ERA001.data.montoActual == 0) return 0;
        return (nodo.data.montoActual / ERA001.data.montoActual);
    }

    private calcularPorcentajeAH(nodo) {
        if (nodo.data.montoAnterior == 0) return 0;
        return (nodo.data.montoActual / nodo.data.montoAnterior);
    }

    private calcularPorcentajeVerticalHorizontal(nodo) {
        if (nodo) {
            nodo.data.porcentajeAV = this.calcularPorcentajeAV(nodo)*100;//.toFixed(2);
            nodo.data.porcentajeAH = this.calcularPorcentajeAH(nodo)*100;//.toFixed(2);
        }
    }

    private calcularCuartaQuintaColumna() {
        this.calcularPorcentajeVerticalHorizontal(this.obtenerNodo(ERAConstants.VentasNetas));
        this.calcularPorcentajeVerticalHorizontal(this.obtenerNodoHijo(ERAConstants.VentasNetas, ERAConstants.VentasNetas_Agricola));
        this.calcularPorcentajeVerticalHorizontal(this.obtenerNodoHijo(ERAConstants.VentasNetas, ERAConstants.VentasNetas_Pecuario));
        this.calcularPorcentajeVerticalHorizontal(this.obtenerNodo(ERAConstants.CostosVentas));
        this.calcularPorcentajeVerticalHorizontal(this.obtenerNodoHijo(ERAConstants.CostosVentas, ERAConstants.CostosVentas_Agricola));
        this.calcularPorcentajeVerticalHorizontal(this.obtenerNodoHijo(ERAConstants.CostosVentas, ERAConstants.CostosVentas_Pecuario));
        this.calcularPorcentajeVerticalHorizontal(this.obtenerNodo(ERAConstants.UtilidadBruta));
        this.calcularPorcentajeVerticalHorizontal(this.obtenerNodoHijo(ERAConstants.UtilidadBruta, ERAConstants.UtilidadBruta_OtrosGastosVentaAdministracion));
        this.calcularPorcentajeVerticalHorizontal(this.obtenerNodo(ERAConstants.UtilidadOperativa));
        this.calcularPorcentajeVerticalHorizontal(this.obtenerNodoHijo(ERAConstants.UtilidadOperativa, ERAConstants.UtilidadOperativa_GastosFinancieros_InteresCdts));
        this.calcularPorcentajeVerticalHorizontal(this.obtenerNodoHijo(ERAConstants.UtilidadOperativa, ERAConstants.UtilidadOperativa_IngresosFinancieros));
        this.calcularPorcentajeVerticalHorizontal(this.obtenerNodo(ERAConstants.UtilidadNeta));
        this.calcularPorcentajeVerticalHorizontal(this.obtenerNodoHijo(ERAConstants.UtilidadNeta, ERAConstants.UtilidadNeta_OtrosIngresos_NoAgropecuarios));
        this.calcularPorcentajeVerticalHorizontal(this.obtenerNodoHijo(ERAConstants.UtilidadNeta, ERAConstants.UtilidadNeta_GastosFamiliares));
        this.calcularPorcentajeVerticalHorizontal(this.obtenerNodo(ERAConstants.ExcedenteNetoEjercicio));
    }


    createItem(nodo) {
        let countERA = '';
        let item: any = {
            data: {
                "codItem": "",
                "descripcion": "",
                "montoActual": 0,
                "montoAnterior": 0,
                "porcentajeAV": 0,
                "porcentajeAH": 0,
                "codItemPadre": nodo.data.codItem
            },
            children: []
        }
        if (this.listData.length < 10) {
            countERA = countERA.concat('00', (this.listData.length + 1).toString())

        } else {
            countERA = countERA.concat('0', (this.listData.length + 1).toString());
        }
        item.data.codItem = "ERA" + countERA;

        nodo.children = [...nodo.children, item];
    }

    addElement(nodo: any) {

        let VentasNetasAgricola = this.obtenerNodoHijo(ERAConstants.VentasNetas, ERAConstants.VentasNetas_Agricola);
        let VentasNetasPecuario = this.obtenerNodoHijo(ERAConstants.VentasNetas, ERAConstants.VentasNetas_Pecuario);
        let CostosVentasAgricola = this.obtenerNodoHijo(ERAConstants.CostosVentas, ERAConstants.CostosVentas_Agricola);
        let CostosVentasPecuario = this.obtenerNodoHijo(ERAConstants.CostosVentas, ERAConstants.CostosVentas_Pecuario);
        let UtilidadNetaOtrosIngresos = this.obtenerNodoHijo(ERAConstants.UtilidadNeta, ERAConstants.UtilidadNeta_OtrosIngresos_NoAgropecuarios);
        switch (nodo.codItem) {
            case ERAConstants.VentasNetas_Agricola:
                if (VentasNetasAgricola) { this.createItem(VentasNetasAgricola); this.isCompletedERA(); }
                if (CostosVentasAgricola) { this.createItem(CostosVentasAgricola); this.isCompletedERA(); }
                break;
            case ERAConstants.VentasNetas_Pecuario:
                if (VentasNetasPecuario) { this.createItem(VentasNetasPecuario); this.isCompletedERA(); }
                if (CostosVentasPecuario) { this.createItem(CostosVentasPecuario); this.isCompletedERA(); }
                break;
            case ERAConstants.UtilidadNeta_OtrosIngresos_NoAgropecuarios:
                if (UtilidadNetaOtrosIngresos) {
                    this.createItem(UtilidadNetaOtrosIngresos);
                }
                break;
        }

    }

    deleteElement(Nodo: any) {
        let VentasNetas = this.obtenerNodo(ERAConstants.VentasNetas);
        let CostosVentas = this.obtenerNodo(ERAConstants.CostosVentas);
        if (VentasNetas && CostosVentas) {
            switch (Nodo.codItemPadre) {
                case ERAConstants.VentasNetas_Agricola:
                    let VentasNetasNodoAgricola = this.obtenerNodoHijo(ERAConstants.VentasNetas, ERAConstants.VentasNetas_Agricola);
                    let costosVentasNodoAgricola = this.obtenerNodoHijo(ERAConstants.CostosVentas, ERAConstants.CostosVentas_Agricola);
                    if (VentasNetasNodoAgricola && costosVentasNodoAgricola) {
                        if (VentasNetasNodoAgricola.children && VentasNetasNodoAgricola.children.length > 0) {
                            let index = VentasNetasNodoAgricola.children.map(function (child) { return child.data.codItem }).indexOf(Nodo.codItem);
                            VentasNetasNodoAgricola.children.splice(index, 1);
                            costosVentasNodoAgricola.children.splice(index, 1);
                        }
                    }
                    break;
                case ERAConstants.VentasNetas_Pecuario:
                    let VentasNetasNodoPecuario = this.obtenerNodoHijo(ERAConstants.VentasNetas, ERAConstants.VentasNetas_Pecuario);
                    let costosVentasNodoPecuario = this.obtenerNodoHijo(ERAConstants.CostosVentas, ERAConstants.CostosVentas_Pecuario);
                    if (VentasNetasNodoPecuario && costosVentasNodoPecuario) {
                        if (VentasNetasNodoPecuario.children && VentasNetasNodoPecuario.children.length > 0) {
                            let index = VentasNetasNodoPecuario.children.map(function (child) { return child.data.codItem }).indexOf(Nodo.codItem);
                            VentasNetasNodoPecuario.children.splice(index, 1);
                            costosVentasNodoPecuario.children.splice(index, 1);
                        }
                    }
                    break;
                case ERAConstants.UtilidadNeta_OtrosIngresos_NoAgropecuarios:
                    let UtilidadNeta = this.obtenerNodo(ERAConstants.UtilidadNeta);
                    if (UtilidadNeta) {
                        if (UtilidadNeta.children && UtilidadNeta.children.length > 0) {
                            let NodoOtrosIngresos = this.obtenerNodoHijo(ERAConstants.UtilidadNeta, ERAConstants.UtilidadNeta_OtrosIngresos_NoAgropecuarios);
                            if (NodoOtrosIngresos) {
                                NodoOtrosIngresos.children = this.removeChildrenOfNode(NodoOtrosIngresos.children, Nodo.codItem);
                            }
                        }
                    }
                    break;
            }
        }
        this.isCompletedERA();
    }

    editElement(Nodo) {
        let VentasNetas = this.obtenerNodo(ERAConstants.VentasNetas);
        let CostosVentas = this.obtenerNodo(ERAConstants.CostosVentas);
        if (VentasNetas && CostosVentas) {
            switch (Nodo.codItemPadre) {
                case ERAConstants.VentasNetas_Agricola:
                    let VentasNetasNodoAgricola = this.obtenerNodoHijo(ERAConstants.VentasNetas, ERAConstants.VentasNetas_Agricola);
                    let costosVentasNodoAgricola = this.obtenerNodoHijo(ERAConstants.CostosVentas, ERAConstants.CostosVentas_Agricola);
                    if (VentasNetasNodoAgricola && costosVentasNodoAgricola) {
                        if (VentasNetasNodoAgricola.children && VentasNetasNodoAgricola.children.length > 0) {
                            let index = VentasNetasNodoAgricola.children.map(function (child) { return child.data.codItem }).indexOf(Nodo.codItem);
                            let agricolaVentasItem = VentasNetasNodoAgricola.children[index];
                            let pecuarioCostosItem = costosVentasNodoAgricola.children[index];
                            pecuarioCostosItem.data.descripcion = agricolaVentasItem.data.descripcion;
                        }
                    }
                    break;
                case ERAConstants.VentasNetas_Pecuario:
                    let VentasNetasNodoPecuario = this.obtenerNodoHijo(ERAConstants.VentasNetas, ERAConstants.VentasNetas_Pecuario);
                    let costosVentasNodoPecuario = this.obtenerNodoHijo(ERAConstants.CostosVentas, ERAConstants.CostosVentas_Pecuario);
                    if (VentasNetasNodoPecuario && costosVentasNodoPecuario) {
                        if (VentasNetasNodoPecuario.children && VentasNetasNodoPecuario.children.length > 0) {
                            let index = VentasNetasNodoPecuario.children.map(function (child) { return child.data.codItem }).indexOf(Nodo.codItem);
                            let pecuarioVentasItem = VentasNetasNodoPecuario.children[index];
                            let pecuarioCostosItem = costosVentasNodoPecuario.children[index];
                            pecuarioCostosItem.data.descripcion = pecuarioVentasItem.data.descripcion;
                        }
                    }
                    break;
                case ERAConstants.UtilidadNeta_OtrosIngresos_NoAgropecuarios:
                    let UtilidadNeta = this.obtenerNodo(ERAConstants.UtilidadNeta);
                    if (UtilidadNeta) {
                        if (UtilidadNeta.children && UtilidadNeta.children.length > 0) {
                            let NodoOtrosIngresos = this.obtenerNodoHijo(ERAConstants.UtilidadNeta, ERAConstants.UtilidadNeta_OtrosIngresos_NoAgropecuarios);
                        }
                    }
                    break;
            }
        }
        this.isCompletedERA();
    }

    private removeChildrenOfNode(children: [], codItem: string) {
        return children.filter(item => item['data']['codItem'] !== codItem);
    }

    isCompletedERA() {
        let completed: boolean = true;
        if (this.data && this.data.length > 0) {
            let listData = this.sharedSvc.convertTreeToList(this.data);
            this.listData = [...listData];
            let ERA015 = this.obtenerNodo(ERAConstants.ExcedenteNetoEjercicio);
            if (ERA015) {
                if (ERA015.data.montoActual == 0)
                    completed = false;
                else {
                    ERA015.data.montoActual = (ERA015.data.montoActual < 0) ? ERA015.data.montoActual : ERA015.data.montoActual;
                }
            }
            //if(ERA015 == 0 ){
            //    completed = false;
            //} else {
            //    ERA015.data.montoActual = ( ERA015.data.montoActual < 0 ) ? ERA015.data.montoActual*(-1): ERA015.data.montoActual ;
            //}
            // if (ERA015) {
            //     if (ERA015.data.montoActual <= 0)
            //         completed = false;
            // }

        } else {
            completed = false;
        }
        this.store.dispatch(SharedActions.isCompletedERA({ isCompleted: completed }));
    }

}
