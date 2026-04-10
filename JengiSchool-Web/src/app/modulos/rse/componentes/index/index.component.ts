import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { DialogService } from 'src/app/services/comun/dialog.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit, OnDestroy {

  form: FormGroup;

  listComportamiento: any[] = ['OK', 'NO'];

  groupCriterio1: any;
  groupCriterio3: any;
  groupResultadoRSE: any;

  constructor(private _fb: FormBuilder, private dialogService: DialogService,) {
    this.form = this._fb.group({
      nroEntidades: new FormControl(2),
      resultadoCriterio1: new FormControl(null),
      totalCuotasPropuesta: new FormControl(0),
      totalCuotasDeudas: new FormControl(0),
      totalDeudasPotenciales: new FormControl(0),
      totalExcedentes: new FormControl(0),
      ratioCP: new FormControl(0, Validators.min(0)),
      resultadoCriterio2: new FormControl(null),
      creditoVigente: new FormControl(0),
      creditoMeses: new FormControl(0),
      tipoCliente: new FormControl(null),
      comportamiento: new FormControl(null, Validators.required),
      deudaSistemaFinanciero: new FormControl(0),
      parametroNuevo: new FormControl(null),
      parametroRecurrente: new FormControl(null),
      resultadoRse: new FormControl(null),
      condicion: new FormControl(null),
      comentario: new FormControl(null)
    });
  }

  ngOnInit(): void {
    //#region [ Criterio 1 ]
    this.form.controls['nroEntidades'].valueChanges.subscribe((value: number) => {
      let resultadoCriterio1 = this.form.controls['resultadoCriterio1'];
      if (value) {
        if (value <= 3)
          resultadoCriterio1.setValue('OK');
        if (value > 3)
          resultadoCriterio1.setValue('NO');
      } else
        resultadoCriterio1.setValue('');
    });
    //#endregion

    //#region [ Criterio 2 ]
    this.groupCriterio1 = combineLatest([
      this.form.controls['totalCuotasPropuesta'].valueChanges,
      this.form.controls['totalCuotasDeudas'].valueChanges,
      this.form.controls['totalDeudasPotenciales'].valueChanges,
      this.form.controls['totalExcedentes'].valueChanges
    ]).subscribe(value => {
      let totalCuotasPropuesta = +value[0];
      let totalCuotasDeudas = +value[1];
      let totalDeudasPotenciales = +value[2];
      let totalExcedentes = +value[3];
      let ratioCP = (totalCuotasPropuesta + totalCuotasDeudas + totalDeudasPotenciales) / totalExcedentes;
      this.form.controls['ratioCP'].setValue(ratioCP);
      let resultadoCriterio2 = this.form.controls['resultadoCriterio2'];
      if (ratioCP <= 70)
        resultadoCriterio2.setValue('OK');
      if (ratioCP > 70)
        resultadoCriterio2.setValue('NO');
    });
    //#endregion
    //#region [ Criterio 3 ]     
    let creditoVigente = +this.form.controls['creditoVigente'].value;
    let creditoMeses = +this.form.controls['creditoMeses'].value;
    if (creditoVigente > 0)
      if (creditoMeses > 36)
        this.form.controls['tipoCliente'].setValue('RECURRENTE');
      else
        this.form.controls['tipoCliente'].setValue('NUEVO');
    else
      this.form.controls['tipoCliente'].setValue('NUEVO');
    //#endregion

    //#region [ Resultado RSE ]
    this.groupResultadoRSE = combineLatest([
      this.form.controls['resultadoCriterio1'].valueChanges,
      this.form.controls['resultadoCriterio2'].valueChanges,
      this.form.controls['comportamiento'].valueChanges
    ]).subscribe(value => {
      let resultadoCriterio1 = value[0];
      let resultadoCriterio2 = value[1];
      let comportamiento = value[2];
      if (resultadoCriterio1 == "OK" && resultadoCriterio2 == "OK" && comportamiento == "OK") {
        this.form.controls['resultadoRse'].setValue('BAJO');
        this.form.controls['condicion'].setValue('No Expuesto');
      } else {
        this.form.controls['resultadoRse'].setValue('');
        this.form.controls['condicion'].setValue('');
      }
    });
    //#endregion

    //#region [ Condición ]
    this.form.controls['condicion'].valueChanges.subscribe(value => {
      let comentario = this.form.controls['comentario'];
      if (value) {
        if (value == "Expuesto" || value == "Potencialmente Expuesto")
          comentario.addValidators(Validators.required);
        else
          comentario.clearValidators();
      } else
        comentario.clearValidators();
      comentario.updateValueAndValidity();
    });

    //#endregion

    this.form.controls['nroEntidades'].setValue(5);
    this.form.controls['totalCuotasPropuesta'].setValue(0);
    this.form.controls['totalCuotasDeudas'].setValue(0);
    this.form.controls['totalDeudasPotenciales'].setValue(0);
    this.form.controls['totalExcedentes'].setValue(0);
  }

  ngOnDestroy(): void {
    this.groupCriterio1.unsubscribe();
    this.groupResultadoRSE.unsubscribe();
  }

  validarForm() {
    if (this.form.valid) {
    } else {
    }
  }

}
