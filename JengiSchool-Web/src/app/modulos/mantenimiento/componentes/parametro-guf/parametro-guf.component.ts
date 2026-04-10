import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { ParametroVersion } from 'src/app/models/parametroVersion.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-parametro-guf',
  templateUrl: './parametro-guf.component.html',
  styleUrls: ['./parametro-guf.component.css']
})
export class ParametroGufComponent implements OnInit {
  @ViewChild(Table) private tableGUF!: Table;
  @Input() parametroVersion: FormGroup;
  @Input() parametro_BK: ParametroVersion;
  @Input() activo: boolean;

  constructor(private _fb: FormBuilder) { }

  ngOnInit(): void { }

  addParametrosGUF() {
    const control = <FormArray>this.parametroVersion.get('parametrosGUF');
    let index = this.parametroVersion.controls['parametrosGUF'].value.length + 1;
    control.push(
      this._fb.group({
        idParametroGUF: new FormControl(index),
        codigoVersion: new FormControl(this.parametroVersion.controls['codigoVersion'].value),
        nombreGUF: new FormControl('', [Validators.required, Validators.maxLength(35)]),
        editable: new FormControl('1'),
        estado: new FormControl(true)
      })
    );
    this.tableGUF.editingRowKeys = { [index]: true };
  }

  get parametrosGUF(): FormArray {
    return this.parametroVersion.get('parametrosGUF') as FormArray;
  }

  guardarGUF(valid: boolean) {
    if (valid) {
      this.tableGUF.editingRowKeys = {};
    }
    const parametrosGUF = this.parametroVersion.get('parametrosGUF').value;
    this.parametro_BK.parametrosGUF = parametrosGUF;
  }

  cancelarEditar(id: number, index: number) {
    const controlGUF = <FormArray>this.parametroVersion.get('parametrosGUF');
    let foundGUF = this.parametro_BK.parametrosGUF.find(i => i.idParametroGUF === id);
    if (foundGUF) {
      controlGUF.controls[index].setValue(foundGUF);
    } else {
      controlGUF.removeAt(index);
    }
    controlGUF.updateValueAndValidity();
  }

  onRowEditInit(index) {
    this.tableGUF.editingRowKeys = { [index]: true };
    const controlGUF = <FormArray>this.parametroVersion.get('parametrosGUF');
    this.parametro_BK.parametrosGUF.forEach((element, index) => {
      controlGUF.controls[index].setValue(element);
    });
  }

}
