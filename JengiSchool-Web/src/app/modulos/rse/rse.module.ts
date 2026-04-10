import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RseRoutingModule } from './rse-routing.module';
import { IndexComponent } from './componentes/index/index.component';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [
    IndexComponent
  ],
  imports: [
    CommonModule,
    RseRoutingModule,
    CardModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    ButtonModule
  ]
})
export class RseModule { }
