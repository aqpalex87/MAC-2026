import { Injectable } from '@angular/core';
import { SharedService } from './shared.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import * as SharedActions from 'src/app/redux/actions/shared/shared.actions';
import { FlujoCajaESFA, FlujoCajaESFAItem } from 'src/app/models/flujoCajaESFA.interface';
import { ESFAConstants } from 'src/app/shared/common/esfa.constants';
import { FlujoCaja } from 'src/app/models/flujocaja.interface';

@Injectable({
    providedIn: 'root'
})
export class SharedESFAService {

    constructor(private sharedSvc: SharedService
        , private store: Store<AppState>) { }

    private data: any[] = [];
    private listData: any;
    private flujoCaja: FlujoCaja;
    private addNewEFPasivoNoCorriente = true;
    private addNewEFPasivoCorriente = true;

    setData(esfaTree: any[], flujoCaja: FlujoCaja) {
        this.data = esfaTree;
        this.flujoCaja = flujoCaja;
    }

    getData() {
        return this.data;
    }

    getDesembolsoAnterior() {
        return this.flujoCaja
    }

    calcularESFA() {
        this.calcularSegundaColumna();
        this.calcularPatrimonioCapitalESFA();
        this.calcularPasivoPatrimonio();
        this.calcularCuartaColumna();
        this.sumarTotalActual();
        this.isCompletedESFA();
    }

    private calcularMontoActual(nodo) {
        if (nodo) {
            if (nodo.children.length === 0) {
                return nodo.data.montoActual
            }
            const sumaChildren = nodo.children.reduce((acumulador, child) => {
                return acumulador + this.calcularMontoActual(child);
            }, 0);
            nodo.data.montoActual = sumaChildren;
            return nodo.data.montoActual;
        }
    }

    calcularSegundaColumna() {
        let ESFA002 = this.obtenerNodoHijo(ESFAConstants.TotalActivo, ESFAConstants.TotalActivo_ActivoCorriente);
        this.calcularMontoActual(ESFA002);

        let ESF011 = this.obtenerNodoHijo(ESFAConstants.TotalActivo, ESFAConstants.TotalActivo_ActivoNoCorriente);
        this.calcularMontoActual(ESF011);

        let ESFA001 = this.obtenerNodo(ESFAConstants.TotalActivo);
        if (ESFA001 && ESFA002 && ESF011) {
            ESFA001.data.montoActual = ESFA002.data.montoActual + ESF011.data.montoActual;
        }

        let ESFA017 = this.obtenerNodoHijo(ESFAConstants.TotalActivo, ESFAConstants.TotalActivo_PasivoCorriente);
        this.calcularMontoActual(ESFA017);

        let ESFA019 = this.obtenerNodoHijo(ESFAConstants.TotalActivo, ESFAConstants.TotalActivo_PasivoNoCorriente);
        this.calcularMontoActual(ESFA019);

        let ESFA021 = this.obtenerNodoHijo(ESFAConstants.TotalActivo, ESFAConstants.TotalActivo_Patrimonio);

        if (ESFA021) {
            if (ESFA021.children && ESFA021.children.length > 0) {
                let ESFA022 = ESFA021.children.find(child => child.data.codItem === ESFAConstants.Patrimonio_Capital);
                let ESFA023 = ESFA021.children.find(child => child.data.codItem === ESFAConstants.Patrimonio_ResultadoAcumulados);
                let ESFA024 = ESFA021.children.find(child => child.data.codItem === ESFAConstants.Patrimonio_ResultadoEjercicio);

                if (ESFA001 && ESFA017 && ESFA019 && ESFA022 && ESFA023 && ESFA024) {
                    ESFA022.data.montoActual = ESFA001.data.montoActual - (ESFA017.data.montoActual + ESFA019.data.montoActual
                        + ESFA023.data.montoActual + ESFA024.data.montoActual);
                }
            }
        }
        this.calcularMontoActual(ESFA021);

        let ESFA025 = this.obtenerNodo(ESFAConstants.PasivoPatrimonio);
        if (ESFA025) {
            ESFA025.data.montoActual = ESFA017.data.montoActual + ESFA019.data.montoActual + ESFA021.data.montoActual;
        }
    }

    calcularDatosEsfa() {
        this.calcularESFA();
        return this.data;
    }

    sumarTotalActual() {
        if (this.data && this.data.length > 0) {
            const actualizarTotales = (r, o) => r + +(
                o.data.montoActual = (o.children || []).reduce(actualizarTotales, 0) || +(o.data.montoActual) || null
            );
            this.data.reduce(actualizarTotales, 0);
            this.establecerMontoESFA();
            this.isCompletedESFA();
        }
    }

    obtenerNodo(codItem: string) {
        return this.data.find(nodo => nodo.data.codItem === codItem);
    }

    obtenerNodoHijo(codItemPadre: string, codItem: string) {
        let nodo = this.obtenerNodo(codItemPadre);
        if (nodo) {
            if (nodo.children && nodo.children.length > 0) {
                return nodo.children.find(child => child.data.codItem === codItem);
            }
        }
    }

    establecerMontoESFA() {
        let totalActivoESFA = this.data[0];
        if (totalActivoESFA) {
            if (totalActivoESFA.children && totalActivoESFA.children.length > 0) {
                let activoCorriente = totalActivoESFA.children.find(element => element.data.codItem === ESFAConstants.TotalActivo_ActivoCorriente);
                let activoNoCorriente = totalActivoESFA.children.find(element => element.data.codItem === ESFAConstants.TotalActivo_ActivoNoCorriente);
                this.data[0].data.montoActual = activoCorriente.data.montoActual + activoNoCorriente.data.montoActual;
                let efectivo = activoCorriente ? activoCorriente.children.find(child => child.data.codItem === ESFAConstants.ActivoCorriente_Efectivo) : '';
                if (efectivo) {
                    this.store.dispatch(SharedActions.setMontoESFA({ monto: Math.abs(efectivo.data.montoActual) }));
                }
            }
        }
    }

    calcularPorcentajeVerticalHorizontal(nodo) {
        if (nodo) {
            if (nodo.data.codItem === ESFAConstants.TotalActivo) {
                let activoCorriente = nodo.children.find(e => e.data.codItem === ESFAConstants.TotalActivo_ActivoCorriente);
                let activoNoCorriente = nodo.children.find(e => e.data.codItem === ESFAConstants.TotalActivo_ActivoNoCorriente);
                let totalActivo = nodo;

                totalActivo.data.porcentajeAV = ((nodo.data.montoActual == 0 || nodo.data.montoActual == null) ? 0 : activoCorriente.data.montoActual / nodo.data.montoActual) * 100;//.toFixed(2);
                activoCorriente.data.porcentajeAV = ((nodo.data.montoActual == 0 || nodo.data.montoActual == null) ? 0 : activoCorriente.data.montoActual / nodo.data.montoActual) * 100;//.toFixed(2);
                activoNoCorriente.data.porcentajeAV = ((nodo.data.montoActual == 0 || nodo.data.montoActual == null) ? 0 : activoNoCorriente.data.montoActual / nodo.data.montoActual) * 100;//.toFixed(2);

                totalActivo.data.porcentajeAH = ((nodo.data.montoAnterior == 0 || nodo.data.montoAnterior == null) ? 0 : nodo.data.montoActual / nodo.data.montoAnterior) * 100;//.toFixed(2);
                activoCorriente.data.porcentajeAH = ((activoCorriente.data.montoAnterior == 0 || activoCorriente.data.montoAnterior == null) ? 0 : activoCorriente.data.montoActual / activoCorriente.data.montoAnterior) * 100;//.toFixed(2);
                activoNoCorriente.data.porcentajeAH = ((activoNoCorriente.data.montoAnterior == 0 || activoNoCorriente.data.montoAnterior == null) ? 0 : activoNoCorriente.data.montoActual / activoNoCorriente.data.montoAnterior) * 100;//.toFixed(2);
            }
            else if (nodo.data.codItem === ESFAConstants.PasivoPatrimonio) {
                let totalActivo = this.obtenerNodo(ESFAConstants.TotalActivo)
                let pasivoCorriente = totalActivo.children.find(e => e.data.codItem === ESFAConstants.TotalActivo_PasivoCorriente);
                let pasivoNoCorriente = totalActivo.children.find(e => e.data.codItem === ESFAConstants.TotalActivo_PasivoNoCorriente);
                let patrimonio = totalActivo.children.find(e => e.data.codItem === ESFAConstants.TotalActivo_Patrimonio);
                let pasivoPatrimonio = nodo;

                pasivoPatrimonio.data.porcentajeAV = ((nodo.data.montoActual == 0 || nodo.data.montoActual == null) ? 0 : nodo.data.montoActual / nodo.data.montoActual) * 100;//.toFixed(2);
                pasivoCorriente.data.porcentajeAV = ((nodo.data.montoActual == 0 || nodo.data.montoActual == null) ? 0 : pasivoCorriente.data.montoActual / nodo.data.montoActual) * 100;//.toFixed(2);
                pasivoNoCorriente.data.porcentajeAV = ((nodo.data.montoActual == 0 || nodo.data.montoActual == null) ? 0 : pasivoNoCorriente.data.montoActual / nodo.data.montoActual) * 100;//.toFixed(2);
                patrimonio.data.porcentajeAV = ((nodo.data.montoActual == 0 || nodo.data.montoActual == null) ? 0 : patrimonio.data.montoActual / nodo.data.montoActual) * 100;//.toFixed(2);

                pasivoPatrimonio.data.porcentajeAH = ((nodo.data.montoAnterior == 0 || nodo.data.montoAnterior == null) ? 0 : nodo.data.montoActual / nodo.data.montoAnterior) * 100;//.toFixed(2);
                pasivoCorriente.data.porcentajeAH = ((pasivoCorriente.data.montoAnterior == 0 || pasivoCorriente.data.montoAnterior == null) ? 0 : pasivoCorriente.data.montoActual / pasivoCorriente.data.montoAnterior) * 100;//.toFixed(2);
                pasivoNoCorriente.data.porcentajeAH = ((pasivoNoCorriente.data.montoAnterior == 0||pasivoNoCorriente.data.montoAnterior==null) ? 0 : pasivoNoCorriente.data.montoActual / pasivoNoCorriente.data.montoAnterior) * 100;//.toFixed(2);
                patrimonio.data.porcentajeAH = ((patrimonio.data.montoAnterior == 0 || patrimonio.data.montoAnterior == null) ? 0 : patrimonio.data.montoActual / patrimonio.data.montoAnterior) * 100;//.toFixed(2);
            }
            else if (nodo.data.codItem === ESFAConstants.TotalActivo_ActivoCorriente) {
                let totalActivo = this.obtenerNodo(ESFAConstants.TotalActivo)
                nodo.children.forEach(e => {
                    e.data.porcentajeAV = ((totalActivo.data.montoActual == 0 || totalActivo.data.montoActual == null) ? 0 : e.data.montoActual / totalActivo.data.montoActual) * 100;//.toFixed(2);
                    e.data.porcentajeAH = ((e.data.montoAnterior == 0 || e.data.montoAnterior == null) ? 0 : e.data.montoActual / e.data.montoAnterior) * 100;
                });
            }
            else if (nodo.data.codItem === ESFAConstants.TotalActivo_ActivoNoCorriente) {
                let totalActivo = this.obtenerNodo(ESFAConstants.TotalActivo)
                nodo.children.forEach(e => {

                    e.data.porcentajeAV = ((totalActivo.data.montoActual == 0 || totalActivo.data.montoActual == null) ? 0 : e.data.montoActual / totalActivo.data.montoActual) * 100;//.toFixed(2);
                    e.data.porcentajeAH = ((e.data.montoAnterior == 0 || e.data.montoAnterior == null) ? 0 : e.data.montoActual / e.data.montoAnterior) * 100;//.toFixed(2);
                });
            }
            else if (nodo.data.codItem === ESFAConstants.TotalActivo_PasivoCorriente) {
                let PasivoPatrimonio = this.obtenerNodo(ESFAConstants.PasivoPatrimonio)
                if (PasivoPatrimonio)
                    nodo.children.forEach(e => {
                        e.data.porcentajeAV = ((PasivoPatrimonio.data.montoActual == 0 || PasivoPatrimonio.data.montoActual == null) ? 0 : e.data.montoActual / PasivoPatrimonio.data.montoActual) * 100;//.toFixed(2);
                        e.data.porcentajeAH = ((e.data.montoAnterior == 0 || e.data.montoAnterior == null) ? 0 : e.data.montoActual / e.data.montoAnterior) * 100;//.toFixed(2);
                    });
            }
            else if (nodo.data.codItem === ESFAConstants.TotalActivo_PasivoNoCorriente) {
                let PasivoPatrimonio = this.obtenerNodo(ESFAConstants.PasivoPatrimonio)
                if (PasivoPatrimonio)
                    nodo.children.forEach(e => {
                        e.data.porcentajeAV = ((PasivoPatrimonio.data.montoActual == 0 || PasivoPatrimonio.data.montoActual == null) ? 0 : e.data.montoActual / PasivoPatrimonio.data.montoActual) * 100;//.toFixed(2);
                        e.data.porcentajeAH = ((e.data.montoAnterior == 0 || e.data.montoAnterior == null) ? 0 : e.data.montoActual / e.data.montoAnterior) * 100;//.toFixed(2);
                    });
            }
            else if (nodo.data.codItem === ESFAConstants.TotalActivo_Patrimonio) {
                let PasivoPatrimonio = this.obtenerNodo(ESFAConstants.PasivoPatrimonio)
                if (PasivoPatrimonio)
                    nodo.children.forEach(e => {
                        e.data.porcentajeAV = ((PasivoPatrimonio.data.montoActual == 0 || PasivoPatrimonio.data.montoActual == null) ? 0 : e.data.montoActual / PasivoPatrimonio.data.montoActual) * 100;//.toFixed(2);
                        e.data.porcentajeAH = ((e.data.montoAnterior == 0 || e.data.montoAnterior == null) ? 0 : e.data.montoActual / e.data.montoAnterior) * 100;//.toFixed(2);
                    });
            }
        }
    }

    calcularCuartaColumna() {
        this.calcularPorcentajeVerticalHorizontal(this.obtenerNodo(ESFAConstants.TotalActivo));
        this.calcularPorcentajeVerticalHorizontal(this.obtenerNodoHijo(ESFAConstants.TotalActivo, ESFAConstants.TotalActivo_ActivoCorriente));
        this.calcularPorcentajeVerticalHorizontal(this.obtenerNodoHijo(ESFAConstants.TotalActivo, ESFAConstants.TotalActivo_ActivoNoCorriente));
        this.calcularPorcentajeVerticalHorizontal(this.obtenerNodoHijo(ESFAConstants.TotalActivo, ESFAConstants.TotalActivo_PasivoCorriente));
        this.calcularPorcentajeVerticalHorizontal(this.obtenerNodoHijo(ESFAConstants.TotalActivo, ESFAConstants.TotalActivo_PasivoNoCorriente));
        this.calcularPorcentajeVerticalHorizontal(this.obtenerNodoHijo(ESFAConstants.TotalActivo, ESFAConstants.TotalActivo_Patrimonio));
        this.calcularPorcentajeVerticalHorizontal(this.obtenerNodo(ESFAConstants.PasivoPatrimonio));
    }


    isCompletedESFA() {
        let completed: boolean = true;
        let listData = this.sharedSvc.convertTreeToList(this.data);
        this.listData = listData;
        // // this.listData[0].porcentajeAH = -0.5;
        if (listData && listData.length > 0) {
            let ESF001 = this.obtenerNodo(ESFAConstants.TotalActivo);
            if (ESF001) {
                let totalActivo = ESF001.data.montoActual;
                if (totalActivo <= 0)
                    completed = false;
            } else
                completed = false;
            //if (listData.some(item => item.montoActual === 0))
            //  completed = false;
        } else
            completed = false;
        this.store.dispatch(SharedActions.isCompletedESFA({ isCompleted: completed }));
    }

    validarAddNewEFPasivoCorriente(): Boolean {
        return this.addNewEFPasivoCorriente;
    }

    validarAddNewEFPasivoNoCorriente(): Boolean {
        return this.addNewEFPasivoNoCorriente;
    }

    agregarFila(flujoCajaEsfa: FlujoCajaESFAItem): Boolean {
        let countESF = '';
        let addNewFile: Boolean = true;
        let newItem: FlujoCajaESFA = {

            data: {
                codItem: "",
                descripcion: "",
                montoActual: null,
                montoAnterior: 0.0,
                porcentajeAH: 0.0,
                porcentajeAV: 0.0,
                codItemPadre: flujoCajaEsfa.codItem,
                ind: 1
            },
            children: []
        };

        let totalActivo = this.data.find((element) => element.data.codItem == flujoCajaEsfa.codItemPadre);
        if (totalActivo.children && totalActivo.children.length > 0) {
            let nodo = totalActivo.children.find(child => child.data.codItem === flujoCajaEsfa.codItem);
            if (this.listData.length < 10) {
                countESF = countESF.concat('00', (this.listData.length + 1).toString())
            } else {
                countESF = countESF.concat('0', (this.listData.length + 1).toString());
            }
            newItem.data.codItem = "ESF" + countESF;

            //nodo.children = [...nodo.children, newItem];
            nodo.children.forEach(child => {
                if (child.data.descripcion == null || child.data.descripcion == "") {

                    switch (flujoCajaEsfa.codItem) {
                        case ESFAConstants.TotalActivo_PasivoCorriente:
                            this.addNewEFPasivoCorriente = false;
                            break;
                        case ESFAConstants.TotalActivo_PasivoNoCorriente:
                            this.addNewEFPasivoNoCorriente = false;
                            break;
                    }
                } else {
                    switch (flujoCajaEsfa.codItem) {
                        case ESFAConstants.TotalActivo_PasivoCorriente:
                            this.addNewEFPasivoCorriente = true;
                            break;
                        case ESFAConstants.TotalActivo_PasivoNoCorriente:
                            this.addNewEFPasivoNoCorriente = true;
                            break;
                    }
                }
            });


            switch (flujoCajaEsfa.codItem) {
                case ESFAConstants.TotalActivo_PasivoCorriente:
                    if (!this.addNewEFPasivoCorriente) {
                        addNewFile = false;
                    }
                    break;
                case ESFAConstants.TotalActivo_PasivoNoCorriente:
                    if (!this.addNewEFPasivoNoCorriente) {
                        addNewFile = false;
                    }
                    break;
            }
            if (addNewFile) {
                if (nodo.children.length < 11) {
                    nodo.children = [...nodo.children, newItem];
                }
            }

        }

        return addNewFile;
    }

    eliminarFila(flujoCajaEsfa: FlujoCajaESFAItem) {
        for (let i = 0; i < this.data[0].children[2].children.length; i++) {
            if (this.data[0].children[2].children[i].data.codItem == flujoCajaEsfa.codItem) {
                this.data[0].children[2].children = this.data[0].children[2].children.filter(item => item['data']['codItem'] !== flujoCajaEsfa.codItem)
            }
        }

        for (let i = 0; i < this.data[0].children[3].children.length; i++) {
            if (this.data[0].children[3].children[i].data.codItem == flujoCajaEsfa.codItem) {
                this.data[0].children[3].children = this.data[0].children[3].children.filter(item => item['data']['codItem'] !== flujoCajaEsfa.codItem)
            }
        }
    }

    calcularPatrimonioCapitalESFA() {
        let totalActivo: number = 0;
        let pasivoCorriente: number = 0;
        let pasivoNoCorriente: number = 0;
        let resultadoAcumulado: number = 0;
        let resultadoEjercicio: number = 0;

        let totalActivoESFA = this.data;

        this.sumarTotalActual();
        totalActivoESFA.forEach((item) => {
            let ESF001 = this.obtenerNodo(ESFAConstants.TotalActivo);
            totalActivo = ESF001.data.montoActual;
            if (item.data.codItem === ESFAConstants.TotalActivo) {
                if (item.children && item.children.length > 0) {
                    let pasivoCorrienteItem = item.children.find(e => (e.data.codItem === ESFAConstants.TotalActivo_PasivoCorriente));
                    pasivoCorriente = pasivoCorrienteItem.data.montoActual;
                    let pasivoNoCorrienteItem = item.children.find(e => (e.data.codItem === ESFAConstants.TotalActivo_PasivoNoCorriente));
                    pasivoNoCorriente = pasivoNoCorrienteItem.data.montoActual;
                    item.children.forEach(e => {
                        if (e.data.codItem === ESFAConstants.TotalActivo_Patrimonio) {
                            if (e.children && e.children.length > 0) {
                                let resultadoAcumuladoItem = e.children.find(i => (i.data.codItem === ESFAConstants.Patrimonio_ResultadoAcumulados));
                                resultadoAcumulado = resultadoAcumuladoItem.data.montoActual;
                                let resultadoEjercicioItem = e.children.find(i => (i.data.codItem === ESFAConstants.Patrimonio_ResultadoEjercicio));
                                resultadoEjercicio = resultadoEjercicioItem.data.montoActual;
                            }
                        }
                    })
                    let patrimonio = item.children.find(element => element.data.codItem === ESFAConstants.TotalActivo_Patrimonio);
                    let patrimonioCapital = patrimonio.children.find(element => element.data.codItem === ESFAConstants.Patrimonio_Capital);
                    if (patrimonioCapital)
                        patrimonioCapital.data.montoActual = totalActivo - (pasivoCorriente + pasivoNoCorriente + resultadoAcumulado + resultadoEjercicio);
                    this.sumarTotalActual();
                }
            }
        });
    }

    calcularPasivoPatrimonio() {
        let totalActivoESFA = this.obtenerNodo(ESFAConstants.TotalActivo);
        let totalPasivoPatrimonio = this.obtenerNodoHijo(ESFAConstants.TotalActivo, ESFAConstants.TotalActivo_Patrimonio);
        if (totalActivoESFA) {
            if (totalActivoESFA.children && totalActivoESFA.children.length > 0) {
                let pasivoCorriente = totalActivoESFA.children.find(element => element.data.codItem === ESFAConstants.TotalActivo_PasivoCorriente);
                let pasivoNoCorriente = totalActivoESFA.children.find(element => element.data.codItem === ESFAConstants.TotalActivo_PasivoNoCorriente);
                let patrimonio = totalActivoESFA.children.find(element => element.data.codItem === ESFAConstants.TotalActivo_Patrimonio);
                totalPasivoPatrimonio.data.montoActual = pasivoCorriente.data.montoActual + pasivoNoCorriente.data.montoActual + patrimonio.data.montoActual;
                this.sumarTotalActual();
            }
        }
    }


}
