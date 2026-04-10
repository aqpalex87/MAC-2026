import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlujoCajaRoutingModule } from './flujo-caja-routing.module';
import { GufComponent } from './componentes/guf/guf.component';
import { TableModule } from 'primeng/table';
import { SliderModule } from 'primeng/slider';
import { ToastModule } from 'primeng/toast';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { TreeSelectModule } from 'primeng/treeselect';
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressBarModule } from 'primeng/progressbar';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TreeTableModule } from 'primeng/treetable';
import { EsfaComponent } from './componentes/esfa/esfa.component';
import { KeyFilterModule } from 'primeng/keyfilter';
import { MessagesModule } from 'primeng/messages';
import { FlujoCajaConsultaComponent } from './componentes/consulta/consulta.component';
import { DeudasPotencialDirectasModalComponent } from './modal/modal/deudas-potencial-directas-modal/deudas-potencial-directas-modal.component';
import { DeudasPotencialIndirectasModalComponent } from './modal/modal/deudas-potencial-indirectas-modal/deudas-potencial-indirectas-modal.component';
import { FlujoCajaComponent } from './flujo-caja.component';

import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { FieldsetModule } from 'primeng/fieldset';
import { PanelModule } from 'primeng/panel';
import { InputNumberModule } from 'primeng/inputnumber';
import { TabViewModule } from 'primeng/tabview';
import { FlujoCajaDetComponent } from './componentes/flujo-caja-det/flujo-caja-det.component';
import { CalendarModule } from 'primeng/calendar';
import { PdrComponent } from './componentes/flujo-caja-det/pdr/pdr.component';

import { CheckboxModule } from 'primeng/checkbox';
import { OtrosCargosComponent } from './componentes/flujo-caja-det/otros-cargos/otros-cargos.component';
import { SensibilizacionesComponent } from './componentes/flujo-caja-det/sensibilizaciones/sensibilizaciones.component';
import { DatosFinanciarComponent } from './componentes/flujo-caja-det/datos-financiar/datos-financiar.component';
import { HojaProductoComponent } from './componentes/flujo-caja-det/hoja-producto/hoja-producto.component';
import { DatosClienteComponent } from './componentes/datos-cliente/datos-cliente.component';
import { SolicitudCreditoComponent } from './componentes/solicitud-credito/solicitud-credito.component';
import { TablaComponent } from './componentes/flujo-caja-det/tabla/tabla.component';
import { ModalDpdComponent } from './componentes/flujo-caja-det/modals/modal-dpd/modal-dpd.component';
import { ModalDpiComponent } from './componentes/flujo-caja-det/modals/modal-dpi/modal-dpi.component';

import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { ModalEstablecerValorComponent } from './componentes/flujo-caja-det/modals/modal-establecer-valor/modal-establecer-valor.component';
import { RseComponent } from './componentes/rse/rse.component';
import { EraComponent } from './componentes/era/era.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { hojaTrabajoComponent } from './componentes/hoja-trabajo/hoja-trabajo.component';
import { ModalHojaTrabajoComponent } from './componentes/hoja-trabajo/modal-hoja-trabajo/modal-hoja-trabajo.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { RatiosComponent } from './componentes/ratios/ratios.component';
import { FlujoCajaReporteComponent } from './componentes/reporte/reporte.component';
import { AlertasComponent } from './componentes/alertas/alertas.component';

@NgModule({
  declarations: [
    FlujoCajaComponent,
    GufComponent,
    EsfaComponent,
    FlujoCajaConsultaComponent,
    FlujoCajaDetComponent,
    DeudasPotencialDirectasModalComponent,
    DeudasPotencialIndirectasModalComponent,
    PdrComponent,
    hojaTrabajoComponent,
    ModalHojaTrabajoComponent,
    OtrosCargosComponent,
    SensibilizacionesComponent,
    DatosFinanciarComponent,
    HojaProductoComponent,
    DatosClienteComponent,
    SolicitudCreditoComponent,
    TablaComponent,
    ModalDpdComponent,
    ModalDpiComponent,
    ModalEstablecerValorComponent,
    RseComponent,
    EraComponent,
    RatiosComponent,
    FlujoCajaReporteComponent,
    AlertasComponent
  ],
  imports: [
    CommonModule,
    FlujoCajaRoutingModule,
    SliderModule,
    ProgressBarModule,
    TableModule,
    ToastModule,
    TooltipModule,
    AutoCompleteModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MultiSelectModule,
    ButtonModule,
    TagModule,
    InputTextareaModule,
    InputTextModule,
    CardModule,
    TreeSelectModule,
    TreeTableModule,
    KeyFilterModule,
    MessagesModule,
    MatCardModule,
    FieldsetModule,
    PanelModule,
    InputNumberModule,
    TabViewModule,
    CheckboxModule,
    DialogModule,
    DropdownModule,
    SharedModule,
    FileUploadModule,
    MatButtonModule, MatDialogModule,
    CalendarModule
  ],
  exports:[
    GufComponent,
    DatosClienteComponent,
    SolicitudCreditoComponent,
    RatiosComponent,
    EsfaComponent,
    EraComponent,
    FlujoCajaDetComponent,
    RseComponent,
    hojaTrabajoComponent
  ]
})
export class FlujoCajaModule { }
