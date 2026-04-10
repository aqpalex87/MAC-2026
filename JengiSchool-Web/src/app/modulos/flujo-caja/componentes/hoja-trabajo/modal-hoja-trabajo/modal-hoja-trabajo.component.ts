import { Component, Inject , Input} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, ReplaySubject } from 'rxjs';
import { FlujoCajaHT } from 'src/app/models/flujocaja.interface';

@Component({
  selector: 'app-modal-hoja-trabajo',
  templateUrl: './modal-hoja-trabajo.component.html',
  styleUrls: ['./modal-hoja-trabajo.component.css']
})
export class ModalHojaTrabajoComponent {

  @Input() modalTitle: string;
  comment: string = '';
  mostrarMensajeError: boolean = false;
  mostrarMensajeErrorArchivo: boolean = false;

  hojaTrabajo: FlujoCajaHT = {
    id: 0,
    codigoLasefiche: 0,
    comentario: '',
    idLaserfiche: 0,
    estado: '',
    fechaRegistro: '',
    horaRegistro: '',
    usuarioRegistro: '',
    archivoBytes: '',
    extension: '',
    nombre: '',
  };


  constructor(
    public dialogRef: MatDialogRef<ModalHojaTrabajoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  convertFile(file: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => result.next(btoa(event.target.result.toString()));
    return result;
  }

  onSelect(event: any) {
      const file = event.files[ 0 ];
      this.hojaTrabajo.nombre = file.name;
      this.convertFile(file).subscribe(res => this.hojaTrabajo.archivoBytes = res);
  }

  private getExtension(fileName: string) {
    return fileName.split('.').pop();
  }

  save() {
    if (this.comment.trim() !== '' && this.mostrarMensajeErrorArchivo == false) {
      this.mostrarMensajeError = false;
      this.hojaTrabajo.comentario = this.comment;
      this.hojaTrabajo.extension = this.getExtension(this.hojaTrabajo.nombre);
      this.dialogRef.close(this.hojaTrabajo);
    }
    else {
      this.mostrarMensajeError = true;
    }
  }

  close() {
    this.dialogRef.close();
  }

  onUpload(event: UploadEvent) {

    if (event.files && event.files.length > 0) {
      this.mostrarMensajeErrorArchivo = false;
    }
    else {
      this.mostrarMensajeErrorArchivo = true;
    }
  }
}

export interface UploadEvent {
  originalEvent: Event;
  files: File[];
}