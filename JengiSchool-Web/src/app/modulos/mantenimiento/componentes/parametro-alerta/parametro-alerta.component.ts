import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { ParametroVersion } from 'src/app/models/parametroVersion.interface';

@Component({
  selector: 'app-parametro-alerta',
  templateUrl: './parametro-alerta.component.html',
  styleUrls: ['./parametro-alerta.component.css']
})
export class ParametroAlertaComponent implements OnInit {
  @ViewChild(Table) private tableAlerta!: Table;
  @Input() parametroVersion: FormGroup;
  @Input() parametro_BK: ParametroVersion;
  @Input() activo: boolean;

  key: string;
  data: any[] = [];
  valoresCalculo: any[] = ['Efectivo', 'Condicion RSE'];
  reglass: any[] = ['<', '=', '>', '<>'];

  constructor(private _fb: FormBuilder) { }

  ngOnInit(): void {
    this.key = 'idParametroAlerta';
    this.data = this.parametroVersion.controls['parametrosAlerta'].value;
  }

  addParametrosAlerta() {
    const control = <FormArray>this.parametroVersion.get('parametrosAlerta');
    let index = this.parametroVersion.controls['parametrosAlerta'].value.length + 1;
    control.push(
      this._fb.group({
        idParametroAlerta: new FormControl(index),
        codigoVersion: new FormControl(this.parametroVersion.controls['codigoVersion'].value),
        nombreAlerta: new FormControl('', [Validators.required, Validators.maxLength(120)]),
        calculo: new FormControl(0),
        regla: new FormControl(0, Validators.required),
        valorParametro: new FormControl(0, Validators.required),
        comentario: new FormControl('', [Validators.required, Validators.maxLength(50)]),
        estado: new FormControl(0)
      })
    );
  }
  get parametrosAlerta(): FormArray {
    return this.parametroVersion.get('parametrosAlerta') as FormArray;
  }
  guardarAlerta(valid: boolean) {
    if (valid) {
      this.tableAlerta.editingRowKeys = {};
    }
    const parametrosAlerta = this.parametroVersion.get('parametrosAlerta').value;
    this.parametro_BK.parametrosAlerta = parametrosAlerta;
  }

  cancelarEditar(id: number, index: number) {
    const controlAlerta = <FormArray>this.parametroVersion.get('parametrosAlerta');
    let foundAlerta = this.parametro_BK.parametrosAlerta.find(i => i.idParametroAlerta === id);
    if (foundAlerta) {
      controlAlerta.controls[index].setValue(foundAlerta);
    } else {
      controlAlerta.removeAt(index);
    }
    controlAlerta.updateValueAndValidity();
  }

  onRowEditInit(index) {
    this.tableAlerta.editingRowKeys = { [index]: true };
    const controlAlerta = <FormArray>this.parametroVersion.get('parametrosAlerta');
    this.parametro_BK.parametrosAlerta.forEach((element, index) => {
      controlAlerta.controls[index].setValue(element);
    });
  }

  cambiarValor(data: any) {
    let item = this.data.find((i) => i[this.key] == data[this.key]);
    item.estado = !item.estado;
  }

}
