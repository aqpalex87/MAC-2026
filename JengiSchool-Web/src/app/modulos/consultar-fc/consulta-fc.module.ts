import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { SliderModule } from 'primeng/slider';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ConsultarfcRoutingModule } from './consulta-fc-routing.module';
import { ConsultaComponent } from './componentes/consulta/consulta.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ModalObservarComponent } from './componentes/modal-observar/modal-observar.component';
import { FlujoCajaModule } from '../flujo-caja/flujo-caja.module';
import { PanelModule } from 'primeng/panel';
import { TabViewModule } from 'primeng/tabview';
import { GufComponent } from '../flujo-caja/componentes/guf/guf.component';
import { FlujoCajaComponent } from '../flujo-caja/flujo-caja.component';

@NgModule({
  declarations: [
    ConsultaComponent,
    ModalObservarComponent,
  ],
  imports: [
    CommonModule,
    ConsultarfcRoutingModule,
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
    PanelModule,
    TabViewModule,
    MatButtonModule, 
    MatDialogModule,
    FlujoCajaModule
  ]
})

export class ConsultarfcModule { }