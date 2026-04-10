import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { SliderModule } from 'primeng/slider';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { RevisarComponent } from './componentes/revisar/revisar.component';
import { ProgressBarModule } from 'primeng/progressbar';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { KeyFilterModule } from 'primeng/keyfilter';
import { RevisarfcRoutingModule } from './revisar-fc-routing.module';

@NgModule({
  declarations: [
    RevisarComponent,
  ],
  imports: [
    CommonModule,
    RevisarfcRoutingModule,
    SliderModule,
    ProgressBarModule,
    TableModule,
    ToastModule,
    FormsModule,
    ReactiveFormsModule,
    MultiSelectModule,
    ButtonModule,
    TagModule,
    InputTextareaModule,
    InputTextModule,
    CardModule,
    KeyFilterModule,
    MessagesModule,
    ToastModule
  ]
})

export class RevisarfcModule { }
