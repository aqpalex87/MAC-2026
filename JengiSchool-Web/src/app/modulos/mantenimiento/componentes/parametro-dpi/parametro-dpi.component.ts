import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { ParametroVersion } from 'src/app/models/parametroVersion.interface';

@Component({
  selector: 'app-parametro-dpi',
  templateUrl: './parametro-dpi.component.html',
  styleUrls: ['./parametro-dpi.component.css']
})
export class ParametroDpiComponent implements OnInit {
  @ViewChild(Table) private tableDPI!: Table;
  @Input() parametroVersion: FormGroup;
  @Input() parametro_BK: ParametroVersion;
  @Input() activo: boolean;

  constructor(private _fb: FormBuilder) { }

  ngOnInit(): void { }

  addParametrosDPI() {
    const control = <FormArray>this.parametroVersion.get('parametrosDPI');
    let index = this.parametroVersion.controls['parametrosDPI'].value.length + 1;
    control.push(
      this._fb.group({
        idParametroDPI: new FormControl(index),
        codigoVersion: new FormControl(this.parametroVersion.controls['codigoVersion'].value),
        tipoAval: new FormControl('', Validators.required),
        factorCalificacionNormal: new FormControl(0, [Validators.required, Validators.min(1)]),
        factorCalificacionCPP: new FormControl(0, [Validators.required, Validators.min(1)]),
        factorCalificacionDeficiente: new FormControl(0, [Validators.required, Validators.min(1)]),
        factorCalificacionDudoso: new FormControl(0, [Validators.required, Validators.min(1)]),
        factorCalificacionPerdida: new FormControl(0, [Validators.required, Validators.min(1)]),
        tem: new FormControl(0, Validators.min(1)),
        tea: new FormControl(0, [Validators.required, Validators.min(1)]),
        plazo: new FormControl(0, Validators.required),
        comentario: new FormControl('', [Validators.required, Validators.maxLength(50)])
      })
    );
  }
  get parametrosDPI(): FormArray {
    return this.parametroVersion.get('parametrosDPI') as FormArray;
  }
  calcularTEM_DPI(TEA: number, index: number): void {
    const controlDPI = <FormArray>this.parametroVersion.get('parametrosDPI');
    let element = controlDPI.controls[index]['controls']['tem'];
    if (!TEA || TEA == 0) {
      element.setValue(0);
    } else {
      let tem = (Math.pow(1 + TEA / 100, 1 / 12) - 1) * 100;
      element.setValue(tem.toFixed(2));
    }
  }
  guardarDPI(valid: boolean) {
    if (valid) {
      this.tableDPI.editingRowKeys = {};
    }
    const parametrosDPI = this.parametroVersion.get('parametrosDPI').value;
    this.parametro_BK.parametrosDPI = parametrosDPI;
  }
  cancelarEditar(id: number, index: number) {
    const controlDPI = <FormArray>this.parametroVersion.get('parametrosDPI');
    let foundDPI = this.parametro_BK.parametrosDPI.find(i => i.idParametroDPI === id);
    if (foundDPI) {
      controlDPI.controls[index].setValue(foundDPI);
    } else {
      controlDPI.removeAt(index);
    }
    controlDPI.updateValueAndValidity();
  }
  onRowEditInit(index) {
    this.tableDPI.editingRowKeys = { [index]: true };
    const controlDPI = <FormArray>this.parametroVersion.get('parametrosDPI');
    this.parametro_BK.parametrosDPI.forEach((element, index) => {
      controlDPI.controls[index].setValue(element);
    });
  }
}
