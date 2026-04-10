import { Injectable } from '@angular/core';
import { SharedService } from './shared.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import * as SharedActions from 'src/app/redux/actions/shared/shared.actions';
import { FlujoCajaESFA } from 'src/app/models/flujoCajaESFA.interface';
import { ESFAConstants } from 'src/app/shared/common/esfa.constants';
import { FlujoCajaDetalle } from 'src/app/models/FlujoCajaDetalle.interface';
import { FlujoCaja, Rse } from 'src/app/models/flujocaja.interface';
import { FlujoCajaItemConstants } from 'src/app/shared/common/flujoCajaItemConstants';
import { Solicitud } from 'src/app/models/solicitud.interface';

@Injectable({
    providedIn: 'root'
})
export class SharedRSEService {

    constructor(private sharedSvc: SharedService
        , private store: Store<AppState>) { }

    private rse: Rse;
    private flujoCaja: FlujoCaja;
    private esfa: FlujoCajaESFA[] = [];
    private flujoCajaDetalle: FlujoCajaDetalle[] = [];
    private listData: any;
    private solicitud: Solicitud;

    MontoSolicitado_FC: number = 0;
    MontoEfectivo_ESFA: number = 0;
    IngresosFinancieros_FCD: number = 0;
    EgresosAgropecuarios_FCD: number = 0;
    EgresosFinancieros_FCD: number = 0;

    setData(rse, flujoCaja, flujoCajaDetale, esfa, solicitud) {
        if (rse != null) {
            this.rse = rse;
        }
        this.flujoCaja = flujoCaja;
        this.flujoCajaDetalle = flujoCajaDetale;
        this.esfa = esfa;
        this.MontoSolicitado_FC = this.flujoCaja.montoSolicitado;
        this.solicitud = solicitud;
        this.rse.tipoCliente = this.solicitud.tipoCliente;
    }

    getData() {
        return this.rse;
    }

    setDataRSE(rse) {
        this.rse = rse;
    }

    setNullRse() {
        if (this.rse == null) {
            this.rse = {
                nroEntidades: 0,
                ratioCP: 0,
                totCuotasCredito: 0,
                totCuotasDD: 0,
                totDeudaPotenciales: 0,
                totExcedentes: 0,
                tipoCliente: '',
                comportamiento: '',
                deudaSisFinanciero: 0,
                resultado: '',
                condicion: '',
            } as Rse
        }
    }
    calcularRSE() {
        this.setNullRse();
        this.calcularRSE_ESFA();
        this.calcularRSE_FCD();
        this.calcularRatioCP();
        return this.rse;
    }

    LimitarDecimales(numero: number): number {
        return Math.sign(numero) * Math.abs(numero) * 100 / 100;
    }

    calcularRatioCP() {
        this.rse.ratioCP = this.rse.totExcedentes !== 0 ? ((this.rse.totCuotasCredito + this.rse.totCuotasDD + this.rse.totDeudaPotenciales) / this.rse.totExcedentes) : 0;
        this.rse.ratioCP = this.LimitarDecimales(this.rse.ratioCP);//this.rse.ratioCP;
    }

    calcularRSE_ESFA() {
        let esfaData: any[] = this.sharedSvc.convertTreeToList(this.esfa);
        let montoEfectivo = esfaData.find(item => item.codItem === ESFAConstants.ActivoCorriente_Efectivo);
        if (montoEfectivo) {
            this.MontoEfectivo_ESFA = montoEfectivo.montoActual;
        }
        let itemsPasivoCorriente = [...new Set(esfaData.filter(item => item.codItemPadre === 'ESF017').map(item => item.descripcion))].filter(v => v != "");
        let itemsPasivoNoCorriente = [...new Set(esfaData.filter(item => item.codItemPadre === 'ESF019').map(item => item.descripcion))].filter(v => v != "");
        let itemsConcat = itemsPasivoCorriente.concat(itemsPasivoNoCorriente);
        if (itemsConcat.length > 0) {
            let nroEntidades = [... new Set(itemsConcat)].length - 2;
            this.Set_Criterio1_NroEntidades(nroEntidades);
        }
        let sumItemsPasivoCorriente = esfaData.filter(item => item.codItemPadre === ESFAConstants.TotalActivo_PasivoCorriente).reduce((acc, item) => {
            if (itemsPasivoCorriente.includes(item.descripcion)) {
                return acc + item.montoActual;
            }
            return acc;
        }, 0);
        let sumItemsPasivoNoCorriente = esfaData.filter(item => item.codItemPadre === ESFAConstants.TotalActivo_PasivoNoCorriente).reduce((acc, item) => {
            if (itemsPasivoNoCorriente.includes(item.descripcion)) {
                return acc + item.montoActual;
            }
            return acc;
        }, 0);
        this.Set_Criterio2_DeudaSistemaFinanciero(sumItemsPasivoCorriente + sumItemsPasivoNoCorriente);
    }

    Set_Criterio1_NroEntidades(nroEntidades: number) {
        this.rse.nroEntidades = nroEntidades;
    }

    Set_Criterio2_DeudaSistemaFinanciero(deudaSistemaFinanciero: number) {
        this.rse.deudaSisFinanciero = deudaSistemaFinanciero;
    }

    calcularRSE_FCD() {

        //TCA
        let fcd_list: any[] = this.sharedSvc.convertTreeToList(this.flujoCajaDetalle);
        let flujoFinanciero = this.flujoCajaDetalle.find(nodo => nodo.data.codItem === FlujoCajaItemConstants.FlujoFinanciero);
        if (flujoFinanciero) {
            if (flujoFinanciero.children && flujoFinanciero.children.length > 0) {
                let cuotasAmortizaciones = flujoFinanciero.children.find(child => child.data.codItem === FlujoCajaItemConstants.FlujoFinanciero_CuotasAmortizaciones);
                if (cuotasAmortizaciones) {
                    let tca = cuotasAmortizaciones.data['montosPlazo'].reduce((acc, child) => { return acc + child.monto }, 0);
                    this.Set_Criterio2_TCA(tca);
                }
            }
        }

        let egresosFinancierosFC = this.flujoCajaDetalle.find(nodo => nodo.data.codItem === FlujoCajaItemConstants.EgresosFinancieros);

        //TCSF
        let sumatoriaEntidadesFinancieras = 0;
        if (egresosFinancierosFC) {
            if (egresosFinancierosFC.children && egresosFinancierosFC.children.length > 0) {
                egresosFinancierosFC.children.forEach(element => {
                    if (element.data.codItem != FlujoCajaItemConstants.EgresosFinancieros_DeudaPotencialDirecta
                        && element.data.codItem != FlujoCajaItemConstants.EgresosFinancieros_DeudaPotencialIndirecta) {
                        sumatoriaEntidadesFinancieras += element.data.montosPlazo.reduce((acc, child) => { return acc + child.monto }, 0)
                    }
                });
            }
        }
        this.Set_Criterio2_TCSF(sumatoriaEntidadesFinancieras < 0 ? sumatoriaEntidadesFinancieras * -1 : sumatoriaEntidadesFinancieras);

        //TDP
        let totaldeudaspotenciales = 0;
        if (egresosFinancierosFC) {
            if (egresosFinancierosFC.children && egresosFinancierosFC.children.length > 0) {
                egresosFinancierosFC.children.forEach(element => {
                    if (element.data.codItem === FlujoCajaItemConstants.EgresosFinancieros_DeudaPotencialDirecta
                        || element.data.codItem === FlujoCajaItemConstants.EgresosFinancieros_DeudaPotencialIndirecta) {
                        totaldeudaspotenciales += element.data.montosPlazo.reduce((acc, child) => { return acc + child.monto }, 0)
                    }
                });
            }
        }

        this.Set_Criterio2_TDP(totaldeudaspotenciales < 0 ? totaldeudaspotenciales * -1 : totaldeudaspotenciales);


        let totalIngresosAgropecuarios = 0;
        let totalEgresosAgropecuarios = 0;
        let totalEgresosFinancieros = 0;

        let flujoProyecto = this.flujoCajaDetalle.find(nodo => nodo.data.codItem === FlujoCajaItemConstants.FlujoProyecto);

        //let ingresosAgropecuarios = fcd_list.find(item => item.codItem === FlujoCajaItemConstants.FlujoProyecto_IngresosAgropecuarios);
        if (flujoProyecto) {
            let ingresosAgropecuarios = flujoProyecto.children.find(nodo => nodo.data.codItem == FlujoCajaItemConstants.FlujoProyecto_IngresosAgropecuarios);
            if (ingresosAgropecuarios)
                totalIngresosAgropecuarios = ingresosAgropecuarios.data.montosPlazo.reduce((acc, child) => { return acc + child.monto }, 0);
        }

        //let egresosAgropecuarios = fcd_list.find(item => item.codItem === FlujoCajaItemConstants.FlujoProyecto_EgresosAgropecuarios);
        if (flujoProyecto) {
            let egresosAgropecuarios = flujoProyecto.children.find(nodo => nodo.data.codItem === FlujoCajaItemConstants.FlujoProyecto_EgresosAgropecuarios);
            if (egresosAgropecuarios)
                totalEgresosAgropecuarios = egresosAgropecuarios.data.montosPlazo.reduce((acc, child) => { return acc + child.monto }, 0);
        }
        let egresosFinancieros = this.flujoCajaDetalle.find(nodo => nodo.data.codItem === FlujoCajaItemConstants.EgresosFinancieros);
        //fcd_list.find(item => item.codItem === FlujoCajaItemConstants.EgresosFinancieros);
        if (egresosFinancieros) {
            totalEgresosFinancieros = egresosFinancieros.data.montosPlazo.reduce((acc, child) => { return acc + child.monto }, 0);
        }

        let montoEfectivoESFA = 0
        if (flujoFinanciero) {
            if (flujoFinanciero.children && flujoFinanciero.children.length > 0) {
                let montoCredito = flujoFinanciero.children.find(child => child.data.codItem === FlujoCajaItemConstants.FlujoFinanciero_DisponibleAporteSaldoCaja);
                if (montoCredito) {
                    montoEfectivoESFA = montoCredito.data.valorInicial;
                }
            }
        }

        let montoSolicitado = 0;
        if (this.solicitud)
            montoSolicitado = this.solicitud.montoSolicitado;
        this.Set_Criterio2_TEXD(montoSolicitado + montoEfectivoESFA + totalIngresosAgropecuarios + totalEgresosAgropecuarios + totalEgresosFinancieros);
    }

    Set_Criterio2_TCA(totalCuotasPropuestasCredito: number) {
        this.rse.totCuotasCredito = parseFloat(totalCuotasPropuestasCredito.toFixed(2));//this.LimitarDecimales(totalCuotasPropuestasCredito);
    }

    Set_Criterio2_TDP(totalDeudasPotenciales: number) {

        this.rse.totDeudaPotenciales =  parseFloat(totalDeudasPotenciales.toFixed(2));//this.LimitarDecimales(totalDeudasPotenciales);

    }

    Set_Criterio2_TCSF(totalCuotasDeudasDirectasEntidadesFinancieras: number) {
        this.rse.totCuotasDD = parseFloat(totalCuotasDeudasDirectasEntidadesFinancieras.toFixed(2));//this.LimitarDecimales(totalCuotasDeudasDirectasEntidadesFinancieras);
    }

    Set_Criterio2_TEXD(totalExcedentes: number) {
        this.rse.totExcedentes = parseFloat(totalExcedentes.toFixed(2));//this.LimitarDecimales(totalExcedentes);
    }

}
