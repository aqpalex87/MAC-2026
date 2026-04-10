import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { Solicitud } from 'src/app/models/solicitud.interface';
import { selectSolicitud } from 'src/app/redux/selectors/flujo-caja/solicitud.selectors';

@Component({
  selector: 'app-datos-cliente',
  templateUrl: './datos-cliente.component.html',
  styleUrls: ['./datos-cliente.component.css']
})
export class DatosClienteComponent implements OnInit {

  solicitud: Solicitud;
  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.store.select(selectSolicitud).subscribe({
      next: data => {
        if (data) { this.solicitud = data; }
      },
    });
  }

}