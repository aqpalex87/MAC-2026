import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { FlujoCajaGUF } from 'src/app/models/FlujoCajaGUF.interface';
import { FlujoCaja } from 'src/app/models/flujocaja.interface';
import * as SharedActions from '../../redux/actions/shared/shared.actions';
import { GlobalConstants } from 'src/app/shared/common/globalContants';
import { ERAConstants } from 'src/app/shared/common/era.constants';
import { FlujoCajaItemConstants } from 'src/app/shared/common/flujoCajaItemConstants';

export function ConvertTreeToList(treeData: any[]): any[] {
    const result: any[] = [];

    function flatten(node: any) {
        result.push(node.data);
        if (node.children && node.children.length > 0) {
            for (const child of node.children) {
                flatten(child);
            }
        }
    }
    for (const node of treeData) {
        flatten(node);
    }
    return result;
}

@Injectable({
    providedIn: 'root'
})
export class SharedFlujoCajaService {

    private flujoCaja: FlujoCaja;

    constructor(private store: Store<AppState>) { }

    setDataFC(fc: FlujoCaja) {
        this.flujoCaja = fc;
    }

    getDataFC() {
        return this.flujoCaja;
    }

    convertTreeToList(data: any[]) {
        return ConvertTreeToList(data);
    }

    obtenerMesAnioActual(): string {
        let fechaActual = new Date();
        const mes = fechaActual.toLocaleString("es-PE", { month: "short" });
        const anio = fechaActual.toLocaleString("es-PE", { year: "2-digit" });
        return mes.replace(".", "").toUpperCase() + " - " + anio;
    }

    obtenerMesAnioByPeriodo(periodo: number) {

        let dateString = periodo.toString() + '01';
        let year:any  = dateString.substring(0,4);
        let month:any = dateString.substring(4,6);
        let day:any   = dateString.substring(6,8);
        let fecha = new Date(year, month-1, day)

        const mes = fecha.toLocaleString("es-PE", { month: "short" });
        const anio = fecha.toLocaleString("es-PE", { year: "2-digit" });
        return mes.replace(".", "").toUpperCase() + " - " + anio;
    }

    expandir(data: any[]) {
        data.forEach(node => {
            node.expanded = true;
            if (node.children && node.children.length > 0) {
                node.children.forEach(child => {
                    child.expanded = true;
                });
            }
        });
        return [...data];
    }

    isCompletedGUF(guf: any[]) {
        let isCompleted = false;
        if (guf && guf.length > 0) {
            let data = [...guf];
            let sum = -(data
                .filter((item: FlujoCajaGUF) => item.idParametroGasto != GlobalConstants.idCanastaBasicaGUF)
                .reduce((sum: number, current: FlujoCajaGUF) => (+sum + +current.montoActual), 0));
            if (sum != 0) {
                isCompleted = true;
            }
        }
        this.store.dispatch(SharedActions.isCompletedGUF({ isCompleted }));
    }

    isCompletedERA(era: any[]) {
        let completed: boolean = true;
        if (era && era.length > 0) {
            let data = era.map(item => ({ ...item }));
            let eraList = ConvertTreeToList(data);
            let ERA015 = era.find(item => item.codItem === ERAConstants.ExcedenteNetoEjercicio);
            if (ERA015) {
                if (ERA015.data.montoActual === 0)
                    completed = false;
            }
            //if (eraList.some(item => item.montoActual === 0))
              //  completed = false;
        } else {
            completed = false;
        }
        this.store.dispatch(SharedActions.isCompletedERA({ isCompleted: completed }));
    }

    isCompletedFCD(fcd: any[]) {
        let completed = true;
        if (fcd && fcd.length > 0) {
            let data = fcd.map(item => ({ ...item }));
            let listData = ConvertTreeToList(data);
            let FCD015 = listData.find(item => item.codItem === FlujoCajaItemConstants.FlujoFinanciero_CuotasAmortizaciones);
            if (FCD015) {
                if (FCD015.total < this.flujoCaja.montoSolicitado) {
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
        } else {
            completed = false;
        }
        this.store.dispatch(SharedActions.isCompletedFC({ isCompleted: completed }));
    }

}
