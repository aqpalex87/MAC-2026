import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { ParametroVersion } from 'src/app/models/parametroVersion.interface';

@Component({
  selector: 'app-parametro-dpd',
  templateUrl: './parametro-dpd.component.html',
  styleUrls: ['./parametro-dpd.component.css']
})
export class ParametroDpdComponent implements OnInit {
  @ViewChild(Table) private tableDPD!: Table;
  @Input() parametroVersion: FormGroup;
  @Input() parametro_BK: ParametroVersion;
  @Input() activo: boolean;

  constructor(private _fb: FormBuilder) { }

  ngOnInit(): void { }

  addParametrosDPD() {
    const control = <FormArray>this.parametroVersion.get('parametrosDPD');
    let index = this.parametroVersion.controls['parametrosDPD'].value.length + 1;
    control.push(
      this._fb.group({
        idParametroDPD: new FormControl(index),
        codigoVersion: new FormControl(this.parametroVersion.controls['codigoVersion'].value),
        tipoTarjeta: new FormControl(''),
        factorConversion: new FormControl(1, [Validators.required, Validators.min(1)]),
        plazo: new FormControl(1, [Validators.required, Validators.min(1)]),
        tem: new FormControl(1, Validators.min(1)),
        tea: new FormControl(1, [Validators.required, Validators.min(1)]),
        comentario: new FormControl('', Validators.required)
      })
    );
  }
  get parametrosDPD(): FormArray {
    return this.parametroVersion.get('parametrosDPD') as FormArray;
  }
  calcularTEM_DPD(TEA: number, index: number): void {
    const controlDPD = <FormArray>this.parametroVersion.get('parametrosDPD');
    let element = controlDPD.controls[index]['controls']['tem'];
    if (!TEA || TEA == 0) {
      element.setValue(0);
    } else {
      let tem = (Math.pow(1 + TEA / 100, 1 / 12) - 1) * 100;
      element.setValue(tem.toFixed(2));
    }
  }
  guardarDPD(valid: boolean) {
    if (valid) {
      this.tableDPD.editingRowKeys = {};
    }
    const parametrosDPD = this.parametroVersion.get('parametrosDPD').value;
    this.parametro_BK.parametrosDPD = parametrosDPD;
  }

  cancelarEditar(id: number, index: number) {
    const controlDPD = <FormArray>this.parametroVersion.get('parametrosDPD');
    let foundDPD = this.parametro_BK.parametrosDPD.find(i => i.idParametroDPD === id);
    if (foundDPD) {
      controlDPD.controls[index].setValue(foundDPD);
    } else {
      controlDPD.removeAt(index);
    }
    controlDPD.updateValueAndValidity();
  }
  onRowEditInit(index) {
    this.tableDPD.editingRowKeys = { [index]: true };
    const controlDPD = <FormArray>this.parametroVersion.get('parametrosDPD');
    this.parametro_BK.parametrosDPD.forEach((element, index) => {
      controlDPD.controls[index].setValue(element);
    });
  }

}
