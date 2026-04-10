import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DeudaDirecta } from '../../../../../models/flujocaja.interface';

@Component({
  selector: 'app-deudas-potencial-directas-modal',
  templateUrl: './deudas-potencial-directas-modal.component.html',
  styleUrls: ['./deudas-potencial-directas-modal.component.css'],
})
export class DeudasPotencialDirectasModalComponent implements OnInit {
  deudaEditando: DeudaDirecta;
  borderColor = 'red';
  constructor(
    private dialogRef: MatDialogRef<DeudasPotencialDirectasModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { deudadirecta: DeudaDirecta }
  ) {
    // Copia los datos de deudadirecta al objeto deudaEditando usando el operador spread
    this.deudaEditando = { ...data.deudadirecta };
  }

  ngOnInit(): void {
  }

  realizarCalculoConUso(): void {
    const valuecalculo =
      this.calcularCuotaPotencialDirecta(
        this.deudaEditando.consumoCon,
        this.deudaEditando.factorConversion,
        this.deudaEditando.interesMensual,
        this.deudaEditando.numeroPlazo
      );    
      const result = parseFloat(valuecalculo.toFixed(2));        
      this.deudaEditando.cuotaPotencialDirecta = result;
  }
  realizarCalculoConSinUso(): void {
    const valuecalculo =
      this.calcularCuotaPotencialDirecta(
        this.deudaEditando.consumoSin,
        this.deudaEditando.factorConversion,
        this.deudaEditando.interesMensual,
        this.deudaEditando.numeroPlazo
      );    
      const result = parseFloat(valuecalculo.toFixed(2)); 
      const addcion = this.deudaEditando.cuotaPotencialDirecta + result;
      this.deudaEditando.cuotaPotencialDirecta = parseFloat(addcion.toFixed(2)); 

  }
  realizaCalculoMicroEmp(): void {
    const valuecalculo =
      this.calcularCuotaPotencialDirecta(
        this.deudaEditando.microEmpresa,
        this.deudaEditando.factorConversion,
        this.deudaEditando.interesMensual,
        this.deudaEditando.numeroPlazo
      );    
      const result = parseFloat(valuecalculo.toFixed(2)); 
      const addcion = this.deudaEditando.cuotaPotencialDirecta + result;
      this.deudaEditando.cuotaPotencialDirecta = parseFloat(addcion.toFixed(2)); 
  }
  realizarCalculoPequeEmp(): void {
    const valuecalculo =
      this.calcularCuotaPotencialDirecta(
        this.deudaEditando.pequeEmpresa,
        this.deudaEditando.factorConversion,
        this.deudaEditando.interesMensual,
        this.deudaEditando.numeroPlazo
      );   
      const result = parseFloat(valuecalculo.toFixed(2)); 
      const addcion = this.deudaEditando.cuotaPotencialDirecta + result;
      this.deudaEditando.cuotaPotencialDirecta = parseFloat(addcion.toFixed(2)); 
  }

  guardarEdicion(): void {
    // Aquí puedes realizar validaciones y lógica para guardar la edición del objeto
    this.dialogRef.close(this.deudaEditando);
  }

  cancelarEdicion(): void {
    this.dialogRef.close();
  }

  private calcularCuotaPotencialDirecta(
    _VA: number,
    _FC: number,
    _i: number,
    _n: number
  ): number {
    const VA = _VA; // valor ingresado
    const FC = _FC; // factor de conversión
    const i = _i; // tasa efectiva mensual
    const n = _n; // número de plazo
    const resultado = this.FormulaDedudaDirecta(VA, FC, i, n);
    return resultado;
  }

  FormulaDedudaDirecta(VA: number, FC: number, i: number, n: number): number {
    const numerador = VA * (-FC) * i;
    const denominador = 1 - Math.pow(1 + i, -n);
    const resultado = numerador / denominador;
    return resultado;
    //  return (VA * (-FC) * i) / (1 - Math.pow(1 + i, -n)); 
  }
}
