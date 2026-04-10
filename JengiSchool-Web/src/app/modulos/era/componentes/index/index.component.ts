import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})

export class IndexComponent implements OnInit {

  main: FormGroup;
  dataMainList = [
    {
      level: 1, estado: 'VENTAS NETAS', fc_actual: 0.00, fc_anterior: 0.00, vertical: 0, horizontal: 0,
      children: [{
        level: 2, estado: 'AGRICOLA', fc_actual: 0.00, fc_anterior: 0.00, vertical: 0, horizontal: 0,
        children: [{
          level: 3, estado: 'Descripcion 1', fc_actual: 610.00, fc_anterior: 550.00, vertical: 0, horizontal: 0
        },
        {
          level: 3, estado: 'Descripcion 2', fc_actual: 20.00, fc_anterior: 10.00, vertical: 0, horizontal: 0
        }]
      },
      {
        level: 2, estado: 'PECUARIO', fc_actual: 0.00, fc_anterior: 0.00, vertical: 0, horizontal: 0,
        children: [{
          level: 3, estado: 'Descripcion 2', fc_actual: 10.00, fc_anterior: 5.00, vertical: 0, horizontal: 0
        }]
      }
      ]
    },
    {
      level: 1, estado: 'COSTOS VENTAS', fc_actual: 0.00, fc_anterior: 0.00, vertical: 0, horizontal: 0,
      children: [{
        level: 2, estado: 'AGRICOLA', fc_actual: 10.00, fc_anterior: 0.00, vertical: 0, horizontal: 0,
        children: [{
          level: 3, estado: 'Descripcion 1', fc_actual: 30.00, fc_anterior: 110.00, vertical: 0, horizontal: 0
        },
        {
          level: 3, estado: 'Descripcion 2', fc_actual: 10.00, fc_anterior: 5.00, vertical: 0, horizontal: 0
        }]
      },
      {
        level: 2, estado: 'PECUARIO', fc_actual: 0.00, fc_anterior: 0.00, vertical: 0, horizontal: 0,
        children: [{
          level: 3, estado: 'Descripcion 2', fc_actual: 10.00, fc_anterior: 20.00, vertical: 0, horizontal: 0
        }]
      }
      ]
    },
    {
      level: 1, estado: 'UTILIDAD BRUTA', fc_actual: 0.00, fc_anterior: 20.00, vertical: 0, horizontal: 0,
      children: [{
        level: 2, estado: 'OTROS GASTOS VENTA Y ADMINISTRACION', fc_actual: 20.00, fc_anterior: 10.00, vertical: 0, horizontal: 0
      }
      ]
    },
    {
      level: 1, estado: 'UTILIDAD OPERATIVA', fc_actual: 0.00, fc_anterior: 0.00, vertical: 0, horizontal: 0,
      children: [{
        level: 2, estado: 'GTOS FINANCIEROS (INTERESES DE CDTS)', fc_actual: 10.00, fc_anterior: 5.00, vertical: 0, horizontal: 0
      },
      {
        level: 2, estado: 'INGRESOS FINANCIEROS', fc_actual: 50.00, fc_anterior: 10.00, vertical: 2.00, horizontal: 0
      }
      ]
    },
    {
      level: 1, estado: 'UTILIDAD NETA', fc_actual: 0.00, fc_anterior: 0, vertical: 0, horizontal: 0,
      children: [{
        level: 2, estado: 'OTROS INGRESOS NO AGROPECUARIOS', fc_actual: 0, fc_anterior: 0, vertical: 0, horizontal: 0,
        children: [{
          level: 3, estado: 'Descripcion 3', fc_actual: 10.00, fc_anterior: 20.00, vertical: 0, horizontal: 0
        }]
      },
      {
        level: 2, estado: 'GASTOS FAMILIARES', fc_actual: 50.00, fc_anterior: 10.00, vertical: 10.00, horizontal: 0
      }
      ]
    },
    { level: 1, estado: 'EXCEDENTE NETO DEL EJERCICIO', fc_actual: 10.00, fc_anterior: 10.00, vertical: 0, horizontal: 0, }
  ]

  constructor(private _fb: FormBuilder, private cd: ChangeDetectorRef) {
    this.main = new FormGroup({
      roots: new FormArray([])
    });
  }

  ngOnInit() {
    this.build();
    this.cd.detectChanges();
  }

  CalculoSegundaColumna(form, root) {
    switch (form.estado) {
      case "VENTAS NETAS":
      case "COSTOS VENTAS":
        if (form.trunks && form.trunks.length > 0) {
          form.trunks.forEach(trunk => {
            let sum_agricola = 0;
            let sum_pecuario = 0;
            if (trunk.estado == "AGRICOLA") {
              if (trunk.branchs && trunk.branchs.length > 0) {
                sum_agricola = trunk.branchs.map(a => +a.fc_actual).filter(a => a > 0).reduce((a, b) => a + b, 0);
              }
            }
            if (trunk.estado == "PECUARIO") {
              if (trunk.branchs && trunk.branchs.length > 0) {
                sum_pecuario = trunk.branchs.map(a => +a.fc_actual).filter(a => a > 0).reduce((a, b) => a + b, 0);
              }
            }
            trunk.fc_actual = sum_agricola + sum_pecuario;
          });
          return form.fc_actual = form.trunks.map(a => +a.fc_actual).filter(a => a > 0).reduce((a, b) => a + b, 0);
        }
        break;
      case "UTILIDAD BRUTA":
        if (root.roots.length > 0) {
          let resta = 0;
          let sumVentasNetas = 0;
          let sumCostosVentas = 0;
          root.roots.forEach(root => {
            if (root.estado == "VENTAS NETAS") {
              sumVentasNetas = root.fc_actual;
            }
            if (root.estado == "COSTOS VENTAS") {
              sumCostosVentas = root.fc_actual;
            }
          });
          resta = sumVentasNetas - sumCostosVentas;
          form.fc_actual = resta;
          return resta;
        }
        break;
      case "UTILIDAD OPERATIVA":
        if (root.roots.length > 0) {
          let resta = 0;
          let sumUtilidadBruta = 0;
          let sumOtrosGastosVentayAdministracion = 0;
          root.roots.forEach(root => {
            if (root.estado == "UTILIDAD BRUTA") {
              sumUtilidadBruta = root.fc_actual;
              if (root.trunks && root.trunks.length > 0) {
                sumOtrosGastosVentayAdministracion = root.trunks.map(a => +a.fc_actual).filter(a => a > 0).reduce((a, b) => a + b, 0);
              }
            }
          });
          resta = sumUtilidadBruta - sumOtrosGastosVentayAdministracion
          form.fc_actual = resta;
          return resta;
        }
        break;
      case "UTILIDAD NETA":
        if (root.roots.length > 0) {
          let resta = 0;
          let sumUtilidadOperativa = 0;
          let sumIngresosFinancieros = 0;
          let sumGastosFinancieros = 0;
          root.roots.forEach(root => {
            if (root.estado == "UTILIDAD OPERATIVA") {
              sumUtilidadOperativa = root.fc_actual;
              if (root.trunks && root.trunks.length > 0) {
                root.trunks.forEach(trunk => {
                  if (trunk.estado == "INGRESOS FINANCIEROS") {
                    sumIngresosFinancieros = trunk.fc_actual;
                  }
                  if (trunk.estado == "GTOS FINANCIEROS (INTERESES DE CDTS)") {
                    sumGastosFinancieros = trunk.fc_actual;
                  }
                });
              }
            }
          });
          resta = sumUtilidadOperativa + (sumIngresosFinancieros - sumGastosFinancieros);
          form.fc_actual = resta;
          if (form.trunks && form.trunks.length > 0) {
            form.trunks.forEach(trunk => {
              let sumOtrosIngresosNoAgropecuarios = 0;
              if (trunk.estado == "OTROS INGRESOS NO AGROPECUARIOS") {
                if (trunk.branchs && trunk.branchs.length > 0) {
                  return trunk.fc_actual = sumOtrosIngresosNoAgropecuarios = trunk.branchs.map(a => +a.fc_actual).filter(a => a > 0).reduce((a, b) => a + b, 0);
                }
              }
            });
          }
          return resta;
        }
        break;
      case "EXCEDENTE NETO DEL EJERCICIO":
        if (root.roots.length > 0) {
          let resta = 0;
          let sumUtilidadNeta = 0;
          let sumOtrosIngresosNoAgropecuarios = 0;
          let sumGastosFamiliares = 0;
          root.roots.forEach(root => {
            if (root.estado == "UTILIDAD NETA") {
              sumUtilidadNeta = root.fc_actual;
              if (root.trunks && root.trunks.length > 0) {
                root.trunks.forEach(trunk => {
                  if (trunk.estado == "OTROS INGRESOS NO AGROPECUARIOS") {
                    sumOtrosIngresosNoAgropecuarios = trunk.branchs.map(a => +a.fc_actual).filter(a => a > 0).reduce((a, b) => a + b, 0);
                  }
                  if (trunk.estado == "GASTOS FAMILIARES") {
                    sumGastosFamiliares = trunk.fc_actual;
                  }
                })
              }
            }
          });
          resta = sumUtilidadNeta + (sumOtrosIngresosNoAgropecuarios - sumGastosFamiliares);
          form.fc_actual = resta;
          return resta;
        }
        break;
    }
  }

  CalculoTerceraColumna(form, root) {
    switch (form.estado) {
      case "VENTAS NETAS":
      case "COSTOS VENTAS":
        if (form.trunks && form.trunks.length > 0) {
          form.trunks.forEach(trunk => {
            let sum_agricola = 0;
            let sum_pecuario = 0;
            if (trunk.estado == "AGRICOLA") {
              if (trunk.branchs && trunk.branchs.length > 0) {
                sum_agricola = trunk.branchs.map(a => +a.fc_anterior).filter(a => a > 0).reduce((a, b) => a + b, 0);
              }
            }
            if (trunk.estado == "PECUARIO") {
              if (trunk.branchs && trunk.branchs.length > 0) {
                sum_pecuario = trunk.branchs.map(a => +a.fc_anterior).filter(a => a > 0).reduce((a, b) => a + b, 0);
              }
            }
            trunk.fc_anterior = sum_agricola + sum_pecuario;
          });
          return form.fc_anterior = form.trunks.map(a => +a.fc_anterior).filter(a => a > 0).reduce((a, b) => a + b, 0);
        }
        break;
      case "UTILIDAD BRUTA":
        if (root.roots.length > 0) {
          let resta = 0;
          let sumVentasNetas = 0;
          let sumCostosVentas = 0;
          root.roots.forEach(root => {
            if (root.estado == "VENTAS NETAS") {
              sumVentasNetas = root.fc_anterior;
            }
            if (root.estado == "COSTOS VENTAS") {
              sumCostosVentas = root.fc_anterior;
            }
          });
          resta = sumVentasNetas - sumCostosVentas;
          form.fc_anterior = resta;
          return resta;
        }
        break;
      case "UTILIDAD OPERATIVA":
        if (root.roots.length > 0) {
          let resta = 0;
          let sumUtilidadBruta = 0;
          let sumOtrosGastosVentayAdministracion = 0;
          root.roots.forEach(root => {
            if (root.estado == "UTILIDAD BRUTA") {
              sumUtilidadBruta = root.fc_anterior;
              if (root.trunks && root.trunks.length > 0) {
                sumOtrosGastosVentayAdministracion = root.trunks.map(a => +a.fc_anterior).filter(a => a > 0).reduce((a, b) => a + b, 0);
              }
            }
          });
          resta = sumUtilidadBruta - sumOtrosGastosVentayAdministracion
          form.fc_anterior = resta;
          return resta;
        }
        break;
      case "UTILIDAD NETA":
        if (root.roots.length > 0) {
          let resta = 0;
          let sumUtilidadOperativa = 0;
          let sumIngresosFinancieros = 0;
          let sumGastosFinancieros = 0;
          root.roots.forEach(root => {
            if (root.estado == "UTILIDAD OPERATIVA") {
              sumUtilidadOperativa = root.fc_anterior;
              if (root.trunks && root.trunks.length > 0) {
                root.trunks.forEach(trunk => {
                  if (trunk.estado == "INGRESOS FINANCIEROS") {
                    sumIngresosFinancieros = trunk.fc_anterior;
                  }
                  if (trunk.estado == "GTOS FINANCIEROS (INTERESES DE CDTS)") {
                    sumGastosFinancieros = trunk.fc_anterior;
                  }
                });
              }
            }
          });
          resta = sumUtilidadOperativa + (sumIngresosFinancieros - sumGastosFinancieros);
          form.fc_anterior = resta;
          if (form.trunks && form.trunks.length > 0) {
            form.trunks.forEach(trunk => {
              let sumOtrosIngresosNoAgropecuarios = 0;
              if (trunk.estado == "OTROS INGRESOS NO AGROPECUARIOS") {
                if (trunk.branchs && trunk.branchs.length > 0) {
                  return trunk.fc_anterior = sumOtrosIngresosNoAgropecuarios = trunk.branchs.map(a => +a.fc_anterior).filter(a => a > 0).reduce((a, b) => a + b, 0);
                }
              }
            });
          }
          return resta;
        }
        break;
      case "EXCEDENTE NETO DEL EJERCICIO":
        if (root.roots.length > 0) {
          let resta = 0;
          let sumUtilidadNeta = 0;
          let sumOtrosIngresosNoAgropecuarios = 0;
          let sumGastosFamiliares = 0;
          root.roots.forEach(root => {
            if (root.estado == "UTILIDAD NETA") {
              sumUtilidadNeta = root.fc_anterior;
              if (root.trunks && root.trunks.length > 0) {
                root.trunks.forEach(trunk => {
                  if (trunk.estado == "OTROS INGRESOS NO AGROPECUARIOS") {
                    sumOtrosIngresosNoAgropecuarios = trunk.branchs.map(a => +a.fc_anterior).filter(a => a > 0).reduce((a, b) => a + b, 0);
                  }
                  if (trunk.estado == "GASTOS FAMILIARES") {
                    sumGastosFamiliares = trunk.fc_anterior;
                  }
                })
              }
            }
          });
          resta = sumUtilidadNeta + (sumOtrosIngresosNoAgropecuarios - sumGastosFamiliares);
          form.fc_anterior = resta;
          return resta;
        }
        break;
    }
  }

  CalculoCuartaColumna(form, root) {
    let sumVentasNetas = 0;
    let sumCostosVentas = 0;
    let sumUtilidadBruta = 0;
    let sumUtilidadOperativa = 0;
    let sumUtilidadNeta = 0;
    let sumExcedenteNeto = 0;
    root.roots.forEach(root => {
      if (root.estado == "VENTAS NETAS") {
        sumVentasNetas = root.fc_actual;
      }
      if (root.estado == "COSTOS VENTAS") {
        sumCostosVentas = root.fc_actual;
      }
      if (root.estado == "UTILIDAD BRUTA") {
        sumUtilidadBruta = root.fc_actual;
      }
      if (root.estado == "UTILIDAD OPERATIVA") {
        sumUtilidadOperativa = root.fc_actual;
      }
      if (root.estado == "UTILIDAD NETA") {
        sumUtilidadNeta = root.fc_actual;
      }
      if (root.estado == "EXCEDENTE NETO DEL EJERCICIO") {
        sumExcedenteNeto = root.fc_actual;
      }
    });

    switch (form.estado) {
      case "VENTAS NETAS":
        if (form.trunks && form.trunks.length > 0) {
          form.trunks.forEach(trunk => {
            let sum_agricola = 0;
            let sum_pecuario = 0;
            if (trunk.estado == "AGRICOLA") {
              if (trunk.branchs && trunk.branchs.length > 0) {
                sum_agricola = trunk.branchs.map(a => +a.fc_actual).filter(a => a > 0).reduce((a, b) => a + b, 0);
              }
              trunk.vertical = (sum_agricola / sumVentasNetas) * 100;
            }
            if (trunk.estado == "PECUARIO") {
              if (trunk.branchs && trunk.branchs.length > 0) {
                sum_pecuario = trunk.branchs.map(a => +a.fc_actual).filter(a => a > 0).reduce((a, b) => a + b, 0);
              }
              trunk.vertical = (sum_pecuario / sumVentasNetas) * 100;
            }
            form.vertical = (sumVentasNetas / sumVentasNetas) * 100;
          });
          return form.vertical;
        }
        break;
      case "COSTOS VENTAS":
        if (form.trunks && form.trunks.length > 0) {
          form.trunks.forEach(trunk => {
            let sum_agricola = 0;
            let sum_pecuario = 0;
            if (trunk.estado == "AGRICOLA") {
              if (trunk.branchs && trunk.branchs.length > 0) {
                sum_agricola = trunk.branchs.map(a => +a.fc_actual).filter(a => a > 0).reduce((a, b) => a + b, 0);
              }
              trunk.vertical = (sum_agricola / sumVentasNetas) * 100;
            }
            if (trunk.estado == "PECUARIO") {
              if (trunk.branchs && trunk.branchs.length > 0) {
                sum_pecuario = trunk.branchs.map(a => +a.fc_actual).filter(a => a > 0).reduce((a, b) => a + b, 0);
              }
              trunk.vertical = (sum_pecuario / sumVentasNetas) * 100;
            }
            form.vertical = (sumCostosVentas / sumVentasNetas) * 100;
          });
          return form.vertical;
        }
        break;
      case "UTILIDAD BRUTA":
        if (form.trunks && form.trunks.length > 0) {
          form.trunks.forEach(trunk => {
            let sumOtrosGastosVentayAdministracion = 0;
            if (trunk.estado == "OTROS GASTOS VENTA Y ADMINISTRACION") {
              sumOtrosGastosVentayAdministracion = trunk.fc_actual;
              trunk.vertical = (sumOtrosGastosVentayAdministracion / sumVentasNetas) * 100;
            }
            form.vertical = (sumUtilidadBruta / sumVentasNetas) * 100;
          });
          return form.vertical;
        }
        break;
      case "UTILIDAD OPERATIVA":
        if (form.trunks && form.trunks.length > 0) {
          form.trunks.forEach(trunk => {
            let sumGastosFinancieros = 0;
            let sumIngresosFinancieros = 0;
            if (trunk.estado == "GTOS FINANCIEROS (INTERESES DE CDTS)") {
              sumGastosFinancieros = trunk.fc_actual;
              trunk.vertical = (sumGastosFinancieros / sumVentasNetas) * 100;
            }
            if (trunk.estado == "INGRESOS FINANCIEROS") {
              sumIngresosFinancieros = trunk.fc_actual;
              trunk.vertical = (sumIngresosFinancieros / sumVentasNetas) * 100;
            }
            form.vertical = (sumUtilidadOperativa / sumVentasNetas) * 100;
          });
          return form.vertical;
        }
        break;
      case "UTILIDAD NETA":
        if (form.trunks && form.trunks.length > 0) {
          form.trunks.forEach(trunk => {
            let sumOtrosIngresosNoAgropecuarios = 0;
            let sumGastosFamiliares = 0;
            if (trunk.estado == "OTROS INGRESOS NO AGROPECUARIOS") {
              if (trunk.branchs && trunk.branchs.length > 0) {
                sumOtrosIngresosNoAgropecuarios = trunk.branchs.map(a => +a.fc_actual).filter(a => a > 0).reduce((a, b) => a + b, 0);
              }
              trunk.vertical = (sumOtrosIngresosNoAgropecuarios / sumVentasNetas) * 100;
            }
            if (trunk.estado == "GASTOS FAMILIARES") {
              sumGastosFamiliares = trunk.fc_actual;
              trunk.vertical = (sumGastosFamiliares / sumVentasNetas) * 100;
            }
            form.vertical = (sumUtilidadNeta / sumVentasNetas) * 100;
          });
          return form.vertical;
        }
        break;
      case "EXCEDENTE NETO DEL EJERCICIO":
        form.vertical = (sumExcedenteNeto / sumVentasNetas) * 100
        return form.vertical;
        break;
    }
  }

  CalculoQuintaColumna(form, root) {
    let sumVentasNetasSegunda = 0;
    let sumVentasNetasTercera = 0;
    let sumCostosVentasSegunda = 0;
    let sumCostosVentasTercera = 0;
    let sumUtilidadBrutaSegunda = 0;
    let sumUtilidadBrutaTercera = 0;
    let sumUtilidadOperativaSegunda = 0;
    let sumUtilidadOperativaTercera = 0;
    let sumUtilidadNetaSegunda = 0;
    let sumUtilidadNetaTercera = 0;
    let sumExcenteNetoSegunda = 0;
    let sumExcenteNetoTercera = 0;

    root.roots.forEach(root => {
      if (root.estado == "VENTAS NETAS") {
        sumVentasNetasSegunda = root.fc_actual;
        sumVentasNetasTercera = root.fc_anterior;
      }
      if (root.estado == "COSTOS VENTAS") {
        sumCostosVentasSegunda = root.fc_actual;
        sumCostosVentasTercera = root.fc_anterior;
      }
      if (root.estado == "UTILIDAD BRUTA") {
        sumUtilidadBrutaSegunda = root.fc_actual;
        sumUtilidadBrutaTercera = root.fc_anterior;
      }
      if (root.estado == "UTILIDAD OPERATIVA") {
        sumUtilidadOperativaSegunda = root.fc_actual;
        sumUtilidadOperativaTercera = root.fc_anterior;
      }
      if (root.estado == "UTILIDAD NETA") {
        sumUtilidadNetaSegunda = root.fc_actual;
        sumUtilidadNetaTercera = root.fc_anterior;
      }
      if (root.estado == "EXCEDENTE NETO DEL EJERCICIO") {
        sumExcenteNetoSegunda = root.fc_actual;
        sumExcenteNetoTercera = root.fc_anterior;
      }
    });

    switch (form.estado) {
      case "VENTAS NETAS":
        if (form.trunks && form.trunks.length > 0) {
          form.trunks.forEach(trunk => {
            let sum_agricolaSegunda = 0;
            let sum_agricolaTercera = 0;
            let sum_pecuarioSegunda = 0;
            let sum_pecuarioTercera = 0;
            if (trunk.estado == "AGRICOLA") {
              if (trunk.branchs && trunk.branchs.length > 0) {
                sum_agricolaSegunda = trunk.branchs.map(a => +a.fc_actual).filter(a => a > 0).reduce((a, b) => a + b, 0);
                sum_agricolaTercera = trunk.branchs.map(a => +a.fc_anterior).filter(a => a > 0).reduce((a, b) => a + b, 0);
              }
              trunk.horizontal = (sum_agricolaSegunda / sum_agricolaTercera) * 100;
            }
            if (trunk.estado == "PECUARIO") {
              if (trunk.branchs && trunk.branchs.length > 0) {
                sum_pecuarioSegunda = trunk.branchs.map(a => +a.fc_actual).filter(a => a > 0).reduce((a, b) => a + b, 0);
                sum_pecuarioTercera = trunk.branchs.map(a => +a.fc_anterior).filter(a => a > 0).reduce((a, b) => a + b, 0);
              }
              trunk.horizontal = (sum_pecuarioSegunda / sum_pecuarioTercera) * 100;
            }
            form.horizontal = (sumVentasNetasSegunda / sumVentasNetasTercera) * 100;
          });
          return form.vertical;
        }
        break;
      case "COSTOS VENTAS":
        if (form.trunks && form.trunks.length > 0) {
          form.trunks.forEach(trunk => {
            let sum_agricolaSegunda = 0;
            let sum_agricolaTercera = 0;
            let sum_pecuarioSegunda = 0;
            let sum_pecuarioTercera = 0;
            if (trunk.estado == "AGRICOLA") {
              if (trunk.branchs && trunk.branchs.length > 0) {
                sum_agricolaSegunda = trunk.branchs.map(a => +a.fc_actual).filter(a => a > 0).reduce((a, b) => a + b, 0);
                sum_agricolaTercera = trunk.branchs.map(a => +a.fc_anterior).filter(a => a > 0).reduce((a, b) => a + b, 0);
              }
              trunk.horizontal = (sum_agricolaSegunda / sum_agricolaTercera) * 100;
            }
            if (trunk.estado == "PECUARIO") {
              if (trunk.branchs && trunk.branchs.length > 0) {
                sum_pecuarioSegunda = trunk.branchs.map(a => +a.fc_actual).filter(a => a > 0).reduce((a, b) => a + b, 0);
                sum_pecuarioTercera = trunk.branchs.map(a => +a.fc_anterior).filter(a => a > 0).reduce((a, b) => a + b, 0);
              }
              trunk.horizontal = (sum_pecuarioSegunda / sum_pecuarioTercera) * 100;
            }
            form.horizontal = (sumCostosVentasSegunda / sumCostosVentasTercera) * 100;
          });
          return form.horizontal;
        }
        break;
      case "UTILIDAD BRUTA":
        if (form.trunks && form.trunks.length > 0) {
          form.trunks.forEach(trunk => {
            let sumOtrosGastosVentayAdministracionSegunda = 0;
            let sumOtrosGastosVentayAdministracionTercera = 0;
            if (trunk.estado == "OTROS GASTOS VENTA Y ADMINISTRACION") {
              sumOtrosGastosVentayAdministracionSegunda = trunk.fc_actual;
              sumOtrosGastosVentayAdministracionTercera = trunk.fc_anterior;
              trunk.horizontal = (sumOtrosGastosVentayAdministracionSegunda / sumOtrosGastosVentayAdministracionTercera) * 100;
            }
            form.horizontal = (sumUtilidadBrutaSegunda / sumUtilidadBrutaTercera) * 100;
          });
          return form.horizontal;
        }
        break;
      case "UTILIDAD OPERATIVA":
        if (form.trunks && form.trunks.length > 0) {
          form.trunks.forEach(trunk => {
            let sumGastosFinancierosSegunda = 0;
            let sumGastosFinancierosTercera = 0;
            let sumIngresosFinancierosSegunda = 0;
            let sumIngresosFinancierosTercera = 0;
            if (trunk.estado == "GTOS FINANCIEROS (INTERESES DE CDTS)") {
              sumGastosFinancierosSegunda = trunk.fc_actual;
              sumGastosFinancierosTercera = trunk.fc_anterior;
              trunk.horizontal = (sumGastosFinancierosSegunda / sumGastosFinancierosTercera) * 100;
            }
            if (trunk.estado == "INGRESOS FINANCIEROS") {
              sumIngresosFinancierosSegunda = trunk.fc_actual;
              sumIngresosFinancierosTercera = trunk.fc_anterior;
              trunk.horizontal = (sumIngresosFinancierosSegunda / sumIngresosFinancierosTercera) * 100;
            }
            form.horizontal = (sumUtilidadOperativaSegunda / sumUtilidadOperativaTercera) * 100;
          });
          return form.horizontal;
        }
        break;
      case "UTILIDAD NETA":
        if (form.trunks && form.trunks.length > 0) {
          form.trunks.forEach(trunk => {
            let sumOtrosIngresosNoAgropecuariosSegunda = 0;
            let sumOtrosIngresosNoAgropecuariosTercera = 0;
            let sumGastosFamiliaresSegunda = 0;
            let sumGastosFamiliaresTercera = 0;
            if (trunk.estado == "OTROS INGRESOS NO AGROPECUARIOS") {
              if (trunk.branchs && trunk.branchs.length > 0) {
                sumOtrosIngresosNoAgropecuariosSegunda = trunk.branchs.map(a => +a.fc_actual).filter(a => a > 0).reduce((a, b) => a + b, 0);
                sumOtrosIngresosNoAgropecuariosTercera = trunk.branchs.map(a => +a.fc_anterior).filter(a => a > 0).reduce((a, b) => a + b, 0);
              }
              trunk.horizontal = (sumOtrosIngresosNoAgropecuariosSegunda / sumOtrosIngresosNoAgropecuariosTercera) * 100;
            }
            if (trunk.estado == "GASTOS FAMILIARES") {
              sumGastosFamiliaresSegunda = trunk.fc_actual;
              sumGastosFamiliaresTercera = trunk.fc_anterior;
              trunk.horizontal = (sumGastosFamiliaresSegunda / sumGastosFamiliaresTercera) * 100;
            }
            form.horizontal = (sumUtilidadNetaSegunda / sumUtilidadNetaTercera) * 100;
          });
          return form.horizontal;
        }
        break;
      case "EXCEDENTE NETO DEL EJERCICIO":
        form.horizontal = (sumExcenteNetoSegunda / sumExcenteNetoTercera) * 100
        return form.horizontal;
        break;
    }
  }

  calcular(data: any) {
    if (data.roots && data.roots.length > 0) {
      data.roots.forEach(root => {
        if (root.trunks && root.trunks.length > 0) {
          root.trunks.forEach(trunk => {
            if (trunk.branchs && trunk.branchs.length > 0) {
              trunk.fc_actual = trunk.branchs.map(a => +a.fc_actual).filter(a => a > 0).reduce((a, b) => a + b, 0);
              trunk.fc_anterior = trunk.branchs.map(a => +a.fc_anterior).filter(a => a > 0).reduce((a, b) => a + b, 0);
            } else {
              root.fc_actual = root.trunks.map(a => +a.fc_actual).filter(a => a > 0).reduce((a, b) => a + b, 0);
              root.fc_anterior = root.trunks.map(a => +a.fc_anterior).filter(a => a > 0).reduce((a, b) => a + b, 0);
            }
          });
        } else {
          root.fc_actual = root.fc_actual;
        }
        root.fc_actual = root.trunks.map(a => +a.fc_actual).filter(a => a > 0).reduce((a, b) => a + b, 0);
        root.fc_anterior = root.trunks.map(a => +a.fc_anterior).filter(a => a > 0).reduce((a, b) => a + b, 0);
      })
    }
  }

  build() {
    const control = <FormArray>this.main.get('roots');
    this.dataMainList.forEach((element, index) => {
      control.push(
        this._fb.group({
          index: index,
          level: new FormControl(element.level),
          estado: new FormControl(element.estado),
          fc_actual: new FormControl(element.fc_actual),
          fc_anterior: new FormControl(element.fc_anterior),
          vertical: new FormControl(element.vertical),
          horizontal: new FormControl(element.horizontal),
          trunks: new FormArray([])
        })
      );
    })
    this.buildTrunks();
  }

  buildTrunks() {
    this.dataMainList.forEach((element, index) => {
      if (element['children']) {
        const control = <FormArray>this.main.get('roots')['controls'][index].get('trunks');
        element['children'].forEach((item, j) => {
          control.push(
            this._fb.group({
              index: index,
              level: new FormControl(item.level),
              estado: new FormControl(item.estado),
              fc_actual: new FormControl(item.fc_actual),
              fc_anterior: new FormControl(item.fc_anterior),
              vertical: new FormControl(item.vertical),
              horizontal: new FormControl(item.horizontal),
              branchs: new FormArray([])
            })
          );
          this.buildBranchs(index, j);
        })
      }
    })

  }

  buildBranchs(i, j) {
    const control = <FormArray>this.main.get('roots')['controls'][i].get('trunks')['controls'][j].get('branchs');
    if (this.dataMainList[i]['children'][j]['children']) {
      this.dataMainList[i]['children'][j]['children'].forEach((item, k) => {
        control.push(
          this._fb.group({
            index: k,
            level: new FormControl(item.level),
            estado: new FormControl(item.estado),
            fc_actual: new FormControl(item.fc_actual),
            fc_anterior: new FormControl(item.fc_anterior),
            vertical: new FormControl(item.vertical),
            horizontal: new FormControl(item.horizontal),
          })
        );
      });
    }
  }

  add(i, j) {
    const control = <FormArray>this.main.get('roots')['controls'][i].get('trunks')['controls'][j].get('branchs');
    control.push(
      this._fb.group({
        index: j,
        level: new FormControl(3),
        estado: new FormControl('Nuevo Registro'),
        fc_actual: new FormControl(0),
        fc_anterior: new FormControl(0),
        vertical: new FormControl(0),
        horizontal: new FormControl(0),
      })
    );
    this.cd.detectChanges();
  }

  getroots(form) {
    return form.controls.roots.controls;
  }

  gettrunks(form) {
    return form.controls.trunks.controls;
  }

  getbranchs(form) {
    return form.controls.branchs.controls;
  }

  removeOption(i, j, k) {
    const control = <FormArray>this.main.get(['roots', i, 'trunks', j, 'branchs']);
    control.removeAt(k);
  }

  verData() {
  }

}
