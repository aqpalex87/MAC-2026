import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { FlujoCajaERA } from 'src/app/models/flujoCajaERA.interface';
import { FlujoCajaESFA } from 'src/app/models/flujoCajaESFA.interface';
import { FlujoCajaRatio, Rse } from 'src/app/models/flujocaja.interface';
import { selectTablaERA } from 'src/app/redux/selectors/flujo-caja/era.selectors';
import { selectTablaESFA } from 'src/app/redux/selectors/flujo-caja/esfa.selectors';
import { selectRatios, selectUnion_ESFA_ERA } from 'src/app/redux/selectors/flujo-caja/ratios.selectors';
import { selectTabRSE } from 'src/app/redux/selectors/flujo-caja/rse.selectors';
import { SharedService } from 'src/app/services/shared/shared.service';
import { ERAConstants } from 'src/app/shared/common/era.constants';
import { ESFAConstants } from 'src/app/shared/common/esfa.constants';
import { RatiosConstants } from 'src/app/shared/common/ratios.constants';

@Component({
  selector: 'app-ratios',
  templateUrl: './ratios.component.html',
  styleUrls: ['./ratios.component.css']
})
export class RatiosComponent implements OnInit {

  ratios: FlujoCajaRatio[] = [];
  readonly REGLA_MAX = "MAX";
  readonly REGLA_MIN = "MIN";

  constructor(private store: Store<AppState>
    , private sharedSvc: SharedService) { }

  ngOnInit() {
    this.store.select(selectRatios).subscribe({
      next: (data: FlujoCajaRatio[]) => {
        this.ratios = data;
      }
    });
    this.store.select(selectTabRSE).subscribe({
      next: data => {
        if (data) {
          this.calcularRatioSobreendeudamiento(data);
        }
      }
    });
    this.store.select(selectTablaESFA).subscribe({
      next: data => {
        if (data) {
          this.calcularRatioLiquidez(data);
          this.calcularRatioCapitalTrabajo(data);
          this.calcularRatioEndeudamientoPatrimonio(data);
          this.calcularRatioDeudaTotalActivos(data);
        }
      }
    });
    this.store.select(selectTablaERA).subscribe({
      next: data => {
        if (data) {
          this.calcularRatioMargenVentas(data);
        }
      }
    });
    this.store.select(selectUnion_ESFA_ERA).subscribe({
      next: data => {
        if (data) {
          this.calcularRatioRentabilidadActivo(data.era, data.esfa);
          this.calcularRatioRentabilidadPatrimonio(data.era, data.esfa);
        }
      }
    })
  }

  isNumber(o): boolean {
    return !isNaN(o - 0) && o !== null && o !== "" && o !== false && o !== Infinity;
  }

  analizarRatio(ratio: FlujoCajaRatio) {
    let estilo = '';
    switch (ratio.regla.toUpperCase()) {
      case this.REGLA_MAX:
        estilo = (ratio.resultado <= ratio.valorParametro) ? 'green' : 'red';
        break;
      case this.REGLA_MIN:
        estilo = (ratio.resultado >= ratio.valorParametro) ? 'green' : 'red';
        break;
    }
    return estilo;
  }

  calcularRatioSobreendeudamiento(rse: Rse) {
    let sobreendeudamiento = this.ratios.find(item => item.idParametroRatio === RatiosConstants.Sobreendeudamiento);
    if (sobreendeudamiento) {
      sobreendeudamiento.resultado = rse.ratioCP;
    }
  }

  calcularRatioLiquidez(esfa: FlujoCajaESFA[]) {

    let montoActual_activoCorriente = 0;
    let montoActual_pasivoCorriente = 0;
    let esfalist = this.sharedSvc.convertTreeToList(esfa);
    let activoCorriente = esfalist.find(item => item.codItem === ESFAConstants.TotalActivo_ActivoCorriente);
    if (activoCorriente) {
      montoActual_activoCorriente = activoCorriente.montoActual;
    }
    let pasivoCorriente = esfalist.find(item => item.codItem === ESFAConstants.TotalActivo_PasivoCorriente);
    if (pasivoCorriente) {
      montoActual_pasivoCorriente = pasivoCorriente.montoActual;
    }
    let liquidez = this.ratios.find(item => item.idParametroRatio === RatiosConstants.Liquidez);
    if (liquidez) {
      liquidez.resultado = montoActual_activoCorriente / montoActual_pasivoCorriente;
    }
  }

  calcularRatioCapitalTrabajo(esfa: FlujoCajaESFA[]) {
    let montoActual_activoCorriente = 0;
    let montoActual_pasivoCorriente = 0;
    let esfalist = this.sharedSvc.convertTreeToList(esfa);
    let activoCorriente = esfalist.find(item => item.codItem === ESFAConstants.TotalActivo_ActivoCorriente);
    if (activoCorriente) {
      montoActual_activoCorriente = activoCorriente.montoActual;
    }
    let pasivoCorriente = esfalist.find(item => item.codItem === ESFAConstants.TotalActivo_PasivoCorriente);
    if (pasivoCorriente) {
      montoActual_pasivoCorriente = pasivoCorriente.montoActual;
    }
    let capital_trabajo = this.ratios.find(item => item.idParametroRatio === RatiosConstants.CapitalTrabajo);
    if (capital_trabajo) {
      capital_trabajo.resultado = montoActual_activoCorriente - montoActual_pasivoCorriente;
    }
  }

  calcularRatioEndeudamientoPatrimonio(esfa: FlujoCajaESFA[]) {
    let montoActual_pasivoCorriente = 0;
    let montoActual_pasivoNoCorriente = 0;
    let montoActual_Patrimonio = 0;
    let esfalist = this.sharedSvc.convertTreeToList(esfa);
    let pasivoCorriente = esfalist.find(item => item.codItem === ESFAConstants.TotalActivo_PasivoCorriente);
    if (pasivoCorriente) {
      montoActual_pasivoCorriente = pasivoCorriente.montoActual;
    }
    let pasivoNoCorriente = esfalist.find(item => item.codItem === ESFAConstants.TotalActivo_PasivoNoCorriente);
    if (pasivoNoCorriente) {
      montoActual_pasivoNoCorriente = pasivoNoCorriente.montoActual;
    }
    let patrimonio = esfalist.find(item => item.codItem === ESFAConstants.Patrimonio_Capital);
    if (patrimonio) {
      montoActual_Patrimonio = patrimonio.montoActual;
    }
    let endeudamientoPatrimonio = this.ratios.find(item => item.idParametroRatio === RatiosConstants.EndeudamientoPatrimonio);
    if (endeudamientoPatrimonio) {
      endeudamientoPatrimonio.resultado = ((montoActual_pasivoCorriente + montoActual_pasivoNoCorriente) / montoActual_Patrimonio);
    }
  }

  calcularRatioDeudaTotalActivos(esfa: FlujoCajaESFA[]) {
    let montoActual_pasivoCorriente = 0;
    let montoActual_pasivoNoCorriente = 0;
    let montoActual_totalActivo = 0;
    let esfalist = this.sharedSvc.convertTreeToList(esfa);
    let pasivoCorriente = esfalist.find(item => item.codItem === ESFAConstants.TotalActivo_PasivoCorriente);
    if (pasivoCorriente) {
      montoActual_pasivoCorriente = pasivoCorriente.montoActual;
    }
    let pasivoNoCorriente = esfalist.find(item => item.codItem === ESFAConstants.TotalActivo_PasivoNoCorriente);
    if (pasivoNoCorriente) {
      montoActual_pasivoNoCorriente = pasivoNoCorriente.montoActual;
    }
    let totalActivo = esfalist.find(item => item.codItem === ESFAConstants.TotalActivo);
    if (totalActivo) {
      montoActual_totalActivo = totalActivo.montoActual;
    }
    let deudaTotalActivo = this.ratios.find(item => item.idParametroRatio === RatiosConstants.DeudaTotalActivos);
    if (deudaTotalActivo) {
      deudaTotalActivo.resultado = ((montoActual_pasivoCorriente + montoActual_pasivoNoCorriente) / montoActual_totalActivo);
    }
  }

  calcularRatioRentabilidadActivo(era: FlujoCajaERA[], esfa: FlujoCajaESFA[]) {
    let montoActual_utilidadNeta = 0;
    let montoActual_totalActivo = 0;
    let eralist = this.sharedSvc.convertTreeToList(era);
    let utilidadNeta = eralist.find(item => item.codItem === ERAConstants.UtilidadNeta);
    if (utilidadNeta) {
      montoActual_utilidadNeta = utilidadNeta.montoActual;
    }
    let esfalist = this.sharedSvc.convertTreeToList(esfa);
    let totalActivo = esfalist.find(item => item.codItem === ESFAConstants.TotalActivo);
    if (totalActivo) {
      montoActual_totalActivo = totalActivo.montoActual;
    }
    let rentabilidadSobreActivo = this.ratios.find(item => item.idParametroRatio === RatiosConstants.RentabilidadSobreActivo);
    if (rentabilidadSobreActivo) {
      rentabilidadSobreActivo.resultado = montoActual_utilidadNeta / montoActual_totalActivo;
    }
  }

  calcularRatioRentabilidadPatrimonio(era: FlujoCajaERA[], esfa: FlujoCajaESFA[]) {
    let montoActual_utilidadNeta = 0;
    let montoActual_patrimonio = 0;
    let eralist = this.sharedSvc.convertTreeToList(era);
    let utilidadNeta = eralist.find(item => item.codItem === ERAConstants.UtilidadNeta);
    if (utilidadNeta) {
      montoActual_utilidadNeta = utilidadNeta.montoActual;
    }
    let esfalist = this.sharedSvc.convertTreeToList(esfa);
    let patrimonio = esfalist.find(item => item.codItem === ESFAConstants.TotalActivo_Patrimonio);
    if (patrimonio) {
      montoActual_patrimonio = patrimonio.montoActual;
    }
    let rentabilidadSobrePatrimonio = this.ratios.find(item => item.idParametroRatio === RatiosConstants.RentabilidadSobrePatrimonio);
    if (rentabilidadSobrePatrimonio) {
      rentabilidadSobrePatrimonio.resultado = montoActual_utilidadNeta / montoActual_patrimonio;
    }
  }

  calcularRatioMargenVentas(era: FlujoCajaERA[]) {
    let montoActual_utilidadNeta = 0;
    let montoActual_VentasNetas = 0;
    let eralist = this.sharedSvc.convertTreeToList(era);
    let utilidadNeta = eralist.find(item => item.codItem === ERAConstants.UtilidadNeta);
    if (utilidadNeta) {
      montoActual_utilidadNeta = utilidadNeta.montoActual;
    }
    let ventasNetas = eralist.find(item => item.codItem === ERAConstants.VentasNetas);
    if (ventasNetas) {
      montoActual_VentasNetas = ventasNetas.montoActual;
    }
    let MargenVentas = this.ratios.find(item => item.idParametroRatio === RatiosConstants.MargenVentas);
    if (MargenVentas) {
      MargenVentas.resultado = montoActual_utilidadNeta / montoActual_VentasNetas;
    }
  }

}
