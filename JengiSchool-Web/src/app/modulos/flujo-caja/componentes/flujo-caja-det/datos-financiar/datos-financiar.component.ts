import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { Solicitud } from 'src/app/models/solicitud.interface';
import { selectSolicitud } from 'src/app/redux/selectors/flujo-caja/solicitud.selectors';

@Component({
  selector: 'app-datos-financiar',
  templateUrl: './datos-financiar.component.html',
  styleUrls: ['./datos-financiar.component.css']
})
export class DatosFinanciarComponent implements OnInit {

  solicitud: Solicitud;

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.store.select(selectSolicitud).subscribe({
      next: data => {
        if (data) {
          this.solicitud = data;
        }
      },
    });
  }

}
