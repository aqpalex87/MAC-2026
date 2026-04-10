import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { ParametroVersion } from 'src/app/models/parametroVersion.interface';

@Component({
  selector: 'app-parametro-comportamiento',
  templateUrl: './parametro-comportamiento.component.html',
  styleUrls: ['./parametro-comportamiento.component.css']
})
export class ParametroComportamientoComponent implements OnInit {
  @ViewChild(Table) private tableComportamiento!: Table;
  @Input() parametroVersion: FormGroup;
  @Input() parametro_BK: ParametroVersion;
  @Input() activo: boolean;
  
  constructor(private _fb: FormBuilder) { }

  ngOnInit(): void { }

  addParametrosComportamiento() {
    const control = <FormArray>this.parametroVersion.get('parametrosComportamiento');
    let index = this.parametroVersion.controls['parametrosComportamiento'].value.length + 1;
    control.push(
      this._fb.group({
        idParametroComportamiento: new FormControl(index),
        codigoVersion: new FormControl(this.parametroVersion.controls['codigoVersion'].value),
        tipoCliente: new FormControl(''),
        descripcionComportamiento: new FormControl('', [Validators.required, Validators.maxLength(250)]),
        comentario: new FormControl('', [Validators.required, Validators.maxLength(50)]),
        estado: new FormControl(true)
      })
    );
  }
  get parametrosComportamiento(): FormArray {
    return this.parametroVersion.get('parametrosComportamiento') as FormArray;
  }
  guardarComportamiento(valid: boolean) {
    if (valid) {
      this.tableComportamiento.editingRowKeys = {};
    }
    const parametrosComportamiento = this.parametroVersion.get('parametrosComportamiento').value;
    this.parametro_BK.parametrosComportamiento = parametrosComportamiento;
  }

  cancelarEditar(id: number, index: number) {
    const controlComportamiento = <FormArray>this.parametroVersion.get('parametrosComportamiento');
    let foundComportamiento = this.parametro_BK.parametrosComportamiento.find(i => i.idParametroComportamiento === id);
    if (foundComportamiento) {
      controlComportamiento.controls[index].setValue(foundComportamiento);
    } else {
      controlComportamiento.removeAt(index);
    }
    controlComportamiento.updateValueAndValidity();
  }

  onRowEditInit(index) {
    this.tableComportamiento.editingRowKeys = { [index]: true };
    const controlComportamiento = <FormArray>this.parametroVersion.get('parametrosComportamiento');
    this.parametro_BK.parametrosComportamiento.forEach((element, index) => {
      controlComportamiento.controls[index].setValue(element);
    });
  }

}
