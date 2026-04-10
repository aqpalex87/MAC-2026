import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './componentes/index/index.component';
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { ERARoutingModule } from './era-routing.module';
import { ProgressBarModule } from 'primeng/progressbar';
import { TreeTableModule } from 'primeng/treetable';

@NgModule({
  declarations: [
    IndexComponent
  ],
  imports: [
    CommonModule,
    ERARoutingModule,
    TableModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    DialogModule,
    InputNumberModule,
    ProgressBarModule,
    TreeTableModule
  ]
})
export class ERAModule { }
