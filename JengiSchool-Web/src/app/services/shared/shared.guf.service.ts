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
    private flujoCaja: FlujoCaja;

    setData(esfaTree: any[], flujoCaja: FlujoCaja) {
        this.data = esfaTree;
        this.flujoCaja = flujoCaja;
    }

    getData() {
        return this.data;
    }

    getDesembolsoAnterior(){
        return this.flujoCaja
    }

    calcularESFA() {
        this.sumarTotalActual();
        this.isCompletedESFA();
    }

    calcularDatosEsfa() {
        this.calcularESFA();
        return this.data;
    }

    sumarTotalActual() {
        if (this.data && this.data.length > 0) {
            const actualizarTotales = (r, o) => r + +(
                o.data.montoActual = (o.children || []).reduce(actualizarTotales, 0) || +(o.data.montoActual) || 0
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
                let efectivo = activoCorriente ? activoCorriente.children.find(child => child.data.codItem === ESFAConstants.ActivoCorriente_Efectivo) : '';
                if (efectivo) {
                    this.store.dispatch(SharedActions.setMontoESFA({ monto: Math.abs(efectivo.data.montoActual) }));
                }
            }
        }
    }

    isCompletedESFA() {
        let completed: boolean = true;
        let listData = this.sharedSvc.convertTreeToList(this.data);
        if (listData && listData.length > 0) {
            let ESF001 = this.obtenerNodo(ESFAConstants.TotalActivo);
            if (ESF001) {
                let totalActivo = ESF001.data.montoActual;
                if (totalActivo <= 0)
                    completed = false;
            } else
                completed = false;
            if (listData.some(item => item.montoActual === 0))
                completed = false;
        } else
            completed = false;
        this.store.dispatch(SharedActions.isCompletedESFA({ isCompleted: completed }));
    }

    agregarFila(flujoCajaEsfa: FlujoCajaESFAItem) {
        const newItem: FlujoCajaESFA = {
            data: {
                codItem: "",
                descripcion: "",
                montoActual: null,
                montoAnterior: 0.0,
                porcentajeAH: 0.0,
                porcentajeAV: 0.0,
                codItemPadre: flujoCajaEsfa.codItem
            },
            children: []
        };

        let totalActivo = this.data.find((element) => element.data.codItem == flujoCajaEsfa.codItemPadre);
        if (totalActivo.children && totalActivo.children.length > 0) {
            let nodo = totalActivo.children.find(child => child.data.codItem === flujoCajaEsfa.codItem);
            nodo.children = [...nodo.children, newItem];
        }
    }
}
