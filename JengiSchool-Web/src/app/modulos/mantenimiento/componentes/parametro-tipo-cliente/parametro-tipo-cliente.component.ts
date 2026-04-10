import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { ParametroVersion } from 'src/app/models/parametroVersion.interface';

@Component({
  selector: 'app-parametro-tipo-cliente',
  templateUrl: './parametro-tipo-cliente.component.html',
  styleUrls: ['./parametro-tipo-cliente.component.css']
})
export class ParametroTipoClienteComponent implements OnInit {
  @ViewChild(Table) private tableTipoCliente!: Table;
  @Input() parametroVersion: FormGroup;
  @Input() parametro_BK: ParametroVersion;
  @Input() activo: boolean;

  constructor(private _fb: FormBuilder) { }

  ngOnInit(): void { }

  addParametrosTipoCliente() {
    const control = <FormArray>this.parametroVersion.get('parametrosTipoCliente');
    let index = this.parametroVersion.controls['parametrosTipoCliente'].value.length + 1;
    control.push(
      this._fb.group({
        idParametroTipoCliente: new FormControl(index),
        codigoVersion: new FormControl(this.parametroVersion.controls['codigoVersion'].value),
        descripcionTipoCliente: new FormControl(''),
        valorParametro: new FormControl(0, [Validators.required, Validators.min(1)]),
        comentario: new FormControl('', [Validators.required, Validators.maxLength(50)]),
        estado: new FormControl(true)
      })
    );
  }
  get parametrosTipoCliente(): FormArray {
    return this.parametroVersion.get('parametrosTipoCliente') as FormArray;
  }
  guardarTipoCliente(valid: boolean) {
    if (valid) {
      this.tableTipoCliente.editingRowKeys = {};
    }
    const parametrosTipoCliente = this.parametroVersion.get('parametrosTipoCliente').value;
    this.parametro_BK.parametrosTipoCliente = parametrosTipoCliente;
  }

  cancelarEditar(id: number, index: number) {
    const controlTipoCliente = <FormArray>this.parametroVersion.get('parametrosTipoCliente');
    let foundTipoCliente = this.parametro_BK.parametrosTipoCliente.find(i => i.idParametroTipoCliente === id);
    if (foundTipoCliente) {
      controlTipoCliente.controls[index].setValue(foundTipoCliente);
    } else {
      controlTipoCliente.removeAt(index);
    }
    controlTipoCliente.updateValueAndValidity();
  }

  onRowEditInit(index) {
    this.tableTipoCliente.editingRowKeys = { [index]: true };
    const controlTipoCliente = <FormArray>this.parametroVersion.get('parametrosTipoCliente');
    this.parametro_BK.parametrosTipoCliente.forEach((element, index) => {
      controlTipoCliente.controls[index].setValue(element);
    });
  }

}
