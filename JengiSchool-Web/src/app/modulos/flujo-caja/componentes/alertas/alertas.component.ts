import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { FlujoCajaESFA } from 'src/app/models/flujoCajaESFA.interface';
import { Rse } from 'src/app/models/flujocaja.interface';
import { ParametroAlerta } from 'src/app/models/parametroAlerta.interface';
import { selectTablaESFA } from 'src/app/redux/selectors/flujo-caja/esfa.selectors';
import { selectParametrosAlerta, selectParametrosDPD } from 'src/app/redux/selectors/flujo-caja/parametros.selectors';
import { selectTabRSE } from 'src/app/redux/selectors/flujo-caja/rse.selectors';
import { selectMontoESFA } from 'src/app/redux/selectors/shared/shared.selectors';

@Component({
  selector: 'app-alertas',
  templateUrl: './alertas.component.html',
  styleUrls: ['./alertas.component.css']
})
export class AlertasComponent implements OnInit {
  dataESFA: FlujoCajaESFA[] = [];
  efectivoESFA: Number;
  rse: Rse;
  alertas: ParametroAlerta[];
  condicionRSE: Boolean = false;
  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.store.select(selectParametrosAlerta).subscribe({
      next: data => {
        data.forEach(alert => {
          alert.regla = alert.regla.trim();
        });
        this.alertas = data;
      }
    });

    this.store.select(selectMontoESFA).subscribe({
      next: data => {
        this.efectivoESFA = data;
      }
    });

    this.store.select(selectTabRSE).subscribe({
      next: data => {
        if (data) {
          this.rse = data;
          if (this.rse.condicion) {
            if (this.rse.condicion.toLowerCase() == "expuesto")
              this.condicionRSE = true;
          }
        }
      }
    });

  }

}
