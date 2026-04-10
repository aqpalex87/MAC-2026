import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DeudaIndirecta } from '../../../../../models/flujocaja.interface';

@Component({
  selector: 'app-deudas-potencial-indirectas-modal',
  templateUrl: './deudas-potencial-indirectas-modal.component.html',
  styleUrls: ['./deudas-potencial-indirectas-modal.component.css'],
})
export class DeudasPotencialIndirectasModalComponent implements OnInit {
  deudaInEditado: DeudaIndirecta;
  borderColor = 'red';
  avaltemp: number;
  comsumotemp: number;
  cartafianzatemp: number;

  opcionesAvalMYPE = [
    { valor: '2', texto: 'Normal' },
    { valor: '20', texto: 'CPP' },
    { valor: '35', texto: 'Deficiente' },
    { valor: '45', texto: 'Dudoso' },
    { valor: '100', texto: 'Perdidda' },
  ];

  opcionesAvalConsumo = [
    { valor: '3', texto: 'Normal' },
    { valor: '30', texto: 'CPP' },
    { valor: '40', texto: 'Deficiente' },
    { valor: '45', texto: 'Dudoso' },
    { valor: '100', texto: 'Perdidda' },
  ];

  opcionesCartaFianza = [
    { valor: '1', texto: 'Normal' },
    { valor: '5', texto: 'CPP' },
    { valor: '10', texto: 'Deficiente' },
    { valor: '40', texto: 'Dudoso' },
    { valor: '100', texto: 'Perdidda' },
  ];

  constructor(
    private dialogRef: MatDialogRef<DeudasPotencialIndirectasModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { deudaindirecta: DeudaIndirecta }
  ) {
    this.deudaInEditado = { ...data.deudaindirecta };
  }

  ngOnInit(): void {
    this.avaltemp = 0;
    this.comsumotemp = 0;
    this.cartafianzatemp = 0;
  }
  realizarCalculoavalMYPE() {
    const valuecalculo = this.calcularCuotaPotencialIndirecta(
      this.deudaInEditado.avalMYPE,
      this.avaltemp,
      this.deudaInEditado.interesMensual,
      this.deudaInEditado.numeroPlazo
    );
    const result = parseFloat(valuecalculo.toFixed(2));
    this.deudaInEditado.cuotaPotencialIndirecta = result;
  }
  realizarCalculoConsumo() {
    const valuecalculo = this.calcularCuotaPotencialIndirecta(
      this.deudaInEditado.avalConsumo,
      this.comsumotemp,
      this.deudaInEditado.interesMensual,
      this.deudaInEditado.numeroPlazo
    );
    const result = parseFloat(valuecalculo.toFixed(2));
    const addcion = this.deudaInEditado.cuotaPotencialIndirecta + result;
    this.deudaInEditado.cuotaPotencialIndirecta = parseFloat(
      addcion.toFixed(2)
    );
  }
  realizarCalculoCarta() {
    const valuecalculo = this.calcularCuotaPotencialIndirecta(
      this.deudaInEditado.CartaFianza,
      this.cartafianzatemp,
      this.deudaInEditado.interesMensual,
      this.deudaInEditado.numeroPlazo
    );
    const result = parseFloat(valuecalculo.toFixed(2));
    const addcion = this.deudaInEditado.cuotaPotencialIndirecta + result;
    this.deudaInEditado.cuotaPotencialIndirecta = parseFloat(
      addcion.toFixed(2)
    );
  }
  guardarEdicion(): void {
    // Aquí podríamos realizar validaciones y lógica para guardar la edición
    this.dialogRef.close(this.deudaInEditado);
  }

  cancelarEdicion(): void {
    this.dialogRef.close();
  }

  // Agrega estos métodos a tu componente
  onAvalMYPEChange(event: any): void {
    //this.deudaInEditado.avalMYPE = event.value;
    this.avaltemp = event.value;
    if (this.deudaInEditado.avalMYPE > 0) {
      const valuecalculo = this.calcularCuotaPotencialIndirecta(
        this.deudaInEditado.avalMYPE,
        this.avaltemp,
        this.deudaInEditado.interesMensual,
        this.deudaInEditado.numeroPlazo
      );
      const result = parseFloat(valuecalculo.toFixed(2));
      this.deudaInEditado.cuotaPotencialIndirecta = result;
    }
  }

  onAvalConsumoChange(event: any): void {
    //this.deudaInEditado.avalConsumo = event.value;
    this.comsumotemp = event.value;
    if (this.deudaInEditado.avalConsumo > 0) {
      const valuecalculo = this.calcularCuotaPotencialIndirecta(
        this.deudaInEditado.avalConsumo,
        this.comsumotemp,
        this.deudaInEditado.interesMensual,
        this.deudaInEditado.numeroPlazo
      );
      const result = parseFloat(valuecalculo.toFixed(2));
      const addcion = this.deudaInEditado.cuotaPotencialIndirecta + result;
      this.deudaInEditado.cuotaPotencialIndirecta = parseFloat(
        addcion.toFixed(2)
      );
    }
  }

  onCartaFianzaChange(event: any): void {
    //this.deudaInEditado.CartaFianza = event.value;
    this.cartafianzatemp = event.value;
    if (this.deudaInEditado.CartaFianza > 0) {
      const valuecalculo = this.calcularCuotaPotencialIndirecta(
        this.deudaInEditado.CartaFianza,
        this.cartafianzatemp,
        this.deudaInEditado.interesMensual,
        this.deudaInEditado.numeroPlazo
      );
      const result = parseFloat(valuecalculo.toFixed(2));
      const addcion = this.deudaInEditado.cuotaPotencialIndirecta + result;
      this.deudaInEditado.cuotaPotencialIndirecta = parseFloat(
        addcion.toFixed(2)
      );
    }
  }

  private calcularCuotaPotencialIndirecta(
    _VA: number,
    _FCC: number,
    _i: number,
    _n: number
  ): number {
    const VA = _VA; // Valor ingresado
    const FCC = _FCC; // Factor de Conversión según calificación crediticia
    const i = _i; // Tasa efectiva mensual
    const n = _n; // Número de plazo
    const resultado = this.FormulaDeudaIndirecta(VA, FCC, i, n);
    return resultado;
  }
  FormulaDeudaIndirecta(VA: number, FCC: number, i: number, n: number): number {
    const numerador = VA * -FCC * i;
    const denominador = 1 - Math.pow(1 + i, -n);
    const resultado = numerador / denominador;
    return resultado;
    // return (VA * (-FCC) * i) / (1 - Math.pow(1 + i, -n));
  }
}
