import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { ParametroVersion } from 'src/app/models/parametroVersion.interface';

@Component({
  selector: 'app-parametro-ratio',
  templateUrl: './parametro-ratio.component.html',
  styleUrls: ['./parametro-ratio.component.css']
})
export class ParametroRatioComponent implements OnInit {
  @ViewChild(Table) private tableRatio!: Table;
  @Input() parametroVersion: FormGroup;
  @Input() parametro_BK: ParametroVersion;
  @Input() activo: boolean;

  reglas: any[] = ['Min', 'Max'];
  reglass: any[] = ['Menor que', 'Igual', 'Mayor que', 'Diferente'];

  constructor(private _fb: FormBuilder) { }

  ngOnInit(): void { }

  addParametrosRatio() {
    const control = <FormArray>this.parametroVersion.get('parametrosRatio');
    let index = this.parametroVersion.controls['parametrosRatio'].value.length + 1;
    control.push(
      this._fb.group({
        idParametroRatio: new FormControl(index),
        codigoVersion: new FormControl(this.parametroVersion.controls['codigoVersion'].value),
        nombreRatio: new FormControl(''),
        regla: new FormControl(0, Validators.required),
        valorParametro: new FormControl(0, Validators.required),
        calculo: new FormControl(0),
        estado: new FormControl(0)
      })
    );
  }

  get parametrosRatio(): FormArray {
    return this.parametroVersion.get('parametrosRatio') as FormArray;
  }

  guardarRatio(valid: boolean) {
    if (valid) {
      this.tableRatio.editingRowKeys = {};
    }
    const parametrosRatio = this.parametroVersion.get('parametrosRatio').value;
    this.parametro_BK.parametrosRatio = parametrosRatio;
  }

  cancelarEditar(id: number, index: number) {
    const controlRatio = <FormArray>this.parametroVersion.get('parametrosRatio');
    let foundRatio = this.parametro_BK.parametrosRatio.find(i => i.idParametroRatio === id);
    if (foundRatio) {
      controlRatio.controls[index].setValue(foundRatio);
    } else {
      controlRatio.removeAt(index);
    }
    controlRatio.updateValueAndValidity();
  }

  onRowEditInit(index) {
    this.tableRatio.editingRowKeys = { [index]: true };
    const controlRatio = <FormArray>this.parametroVersion.get('parametrosRatio');
    this.parametro_BK.parametrosRatio.forEach((element, index) => {
      controlRatio.controls[index].setValue(element);
    });
  }

}
