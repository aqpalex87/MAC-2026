import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { FlujoCaja } from 'src/app/models/flujocaja.interface';
import { selectFlujoCaja } from 'src/app/redux/selectors/flujo-caja/flujo.caja.selectors';
import { selectIsEditableFC } from 'src/app/redux/selectors/shared/shared.selectors';
import * as ComentariosActions from 'src/app/redux/actions/flujo-caja/comentarios.actions';
import { selectComentarioFCD } from 'src/app/redux/selectors/flujo-caja/comentarios.selectors';

@Component({
  selector: 'app-flujo-caja-det',
  templateUrl: './flujo-caja-det.component.html',
  styleUrls: ['./flujo-caja-det.component.css']
})
export class FlujoCajaDetComponent implements OnInit {

  isEditableFC: boolean = false;
  comentarioFcd: string = '';

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.store.select(selectIsEditableFC).subscribe({
      next: data => {
        if (data) { this.isEditableFC = data; }
      }
    });
    this.store.select(selectComentarioFCD).subscribe({
      next: data => {
        this.comentarioFcd = data;
      }
    });
  }

  onModelChangeComentario(): void {
    this.store.dispatch(ComentariosActions.setComentarioFCD({ comentarioFcd: this.comentarioFcd }));
  }
}
