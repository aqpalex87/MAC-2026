import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-establecer-valor',
  templateUrl: './modal-establecer-valor.component.html',
  styleUrls: ['./modal-establecer-valor.component.css']
})
export class ModalEstablecerValorComponent implements OnInit {

  valor: number | null = null;

  constructor(private dialogRef: MatDialogRef<ModalEstablecerValorComponent>) { }

  ngOnInit(): void {
  }

  establecerValor() {
    this.dialogRef.close({ success: true, data: parseFloat((this.valor != null) ? this.valor.toFixed(2) : "0") });
  }

}
