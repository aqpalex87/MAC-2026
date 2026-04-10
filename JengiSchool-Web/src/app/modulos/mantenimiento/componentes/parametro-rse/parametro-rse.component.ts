import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { ParametroVersion } from 'src/app/models/parametroVersion.interface';

@Component({
  selector: 'app-parametro-rse',
  templateUrl: './parametro-rse.component.html',
  styleUrls: ['./parametro-rse.component.css']
})
export class ParametroRseComponent implements OnInit {
  @ViewChild(Table) private tableRSECondicion!: Table;
  @Input() parametroVersion: FormGroup;
  @Input() parametro_BK: ParametroVersion;
  @Input() activo: boolean;

  condiciones: any[] = ['NO EXPUESTO', 'EXPUESTO', 'POTENCIALMENTE EXPUESTO'];
  resultados: any[] = ['BAJO', 'MEDIO', 'ALTO'];

  constructor(private _fb: FormBuilder) { }

  ngOnInit(): void { }

  addParametrosRSECondicion() {
    const control = <FormArray>this.parametroVersion.get('parametrosRSECondicion');
    let index = this.parametroVersion.controls['parametrosRSECondicion'].value.length + 1;
    control.push(
      this._fb.group({
        idParametroRSECondicion: new FormControl(index),
        codigoVersion: new FormControl(this.parametroVersion.controls['codigoVersion'].value),
        rse: new FormControl(''),
        criterio01: new FormControl(''),
        criterio02: new FormControl(''),
        criterio03: new FormControl(''),
        resultado: new FormControl('', Validators.required),
        condicion: new FormControl('', Validators.required),
        comentario: new FormControl('', [Validators.required, Validators.maxLength(50)]),
        estado: new FormControl(true)
      })
    );
  }
  get parametrosRSECondicion(): FormArray {
    return this.parametroVersion.get('parametrosRSECondicion') as FormArray;
  }
  guardarRSECondicion(valid: boolean) {
    if (valid) {
      this.tableRSECondicion.editingRowKeys = {};
    }
    const parametrosRSECondicion = this.parametroVersion.get('parametrosRSECondicion').value;
    this.parametro_BK.parametrosRSECondicion = parametrosRSECondicion;
  }

  cancelarEditar(id: number, index: number) {
    const controlRSECondicion = <FormArray>this.parametroVersion.get('parametrosRSECondicion');
    let foundRSECondicion = this.parametro_BK.parametrosRSECondicion.find(i => i.idParametroRSECondicion === id);
    if (foundRSECondicion) {
      controlRSECondicion.controls[index].setValue(foundRSECondicion);
    } else {
      controlRSECondicion.removeAt(index);
    }
    controlRSECondicion.updateValueAndValidity();
  }

  onRowEditInit(index) {
    this.tableRSECondicion.editingRowKeys = { [index]: true };
    const controlRSECondicion = <FormArray>this.parametroVersion.get('parametrosRSECondicion');
    this.parametro_BK.parametrosRSECondicion.forEach((element, index) => {
      controlRSECondicion.controls[index].setValue(element);
    });
  }

}
