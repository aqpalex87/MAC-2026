import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-observar',
  templateUrl: './modal-observar.component.html',
  styleUrls: ['./modal-observar.component.css']
})
export class ModalObservarComponent   {

  comment: string = '';
  mostrarMensajeError: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<ModalObservarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  save() {
    if (this.comment.trim() !== '') {
      // Realiza acciones para guardar el comentario aquí
      this.mostrarMensajeError = false;
      this.dialogRef.close(this.comment);
    }else
    {
      this.mostrarMensajeError = true;
    }
  }

  close() {
    this.dialogRef.close();
    
  }
  closeWithResult() {
    const result = this.comment; // Puedes obtener el valor del comentario u otro dato
    this.dialogRef.close(result); // Pasar el valor como argumento al cerrar el modal
  }

}
