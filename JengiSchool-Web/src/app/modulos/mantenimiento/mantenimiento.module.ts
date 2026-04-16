import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MantenimientoRoutingModule } from './mantenimiento-routing.module';
import { IndexComponent } from './componentes/index/index.component';
import { TableModule } from 'primeng/table';
import { SliderModule } from 'primeng/slider';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DetalleComponent } from './componentes/detalle/detalle.component';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TreeSelectModule } from 'primeng/treeselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';
import { TabViewModule } from 'primeng/tabview';
import { ParametroGufComponent } from './componentes/parametro-guf/parametro-guf.component';
import { ParametroDpdComponent } from './componentes/parametro-dpd/parametro-dpd.component';
import { ParametroDpiComponent } from './componentes/parametro-dpi/parametro-dpi.component';
import { ParametroRatioComponent } from './componentes/parametro-ratio/parametro-ratio.component';
import { ParametroTipoClienteComponent } from './componentes/parametro-tipo-cliente/parametro-tipo-cliente.component';
import { ParametroRseComponent } from './componentes/parametro-rse/parametro-rse.component';
import { ParametroComportamientoComponent } from './componentes/parametro-comportamiento/parametro-comportamiento.component';
import { ParametroAlertaComponent } from './componentes/parametro-alerta/parametro-alerta.component';
import { MenuComponent } from './componentes/menu/menu.component';
import { SedeComponent } from './componentes/sede/sede.component';
import { EmpresaComponent } from './componentes/empresa/empresa.component';
import { RolComponent } from './componentes/rol/rol.component';
import { MenuRolComponent } from './componentes/menu-rol/menu-rol.component';
import { TreeModule } from 'primeng/tree';
import { UsuarioComponent } from './componentes/usuario/usuario.component';
import { UniversidadComponent } from './componentes/universidad/universidad.component';
import { CicloComponent } from './componentes/ciclo/ciclo.component';
import { AlumnoComponent } from './componentes/alumno/alumno.component';

import { MatSelectModule } from '@angular/material/select';   
import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
  declarations: [
    IndexComponent,
    DetalleComponent,
    ParametroGufComponent,
    ParametroDpdComponent,
    ParametroDpiComponent,
    ParametroRatioComponent,
    ParametroTipoClienteComponent,
    ParametroRseComponent,
    ParametroComportamientoComponent,
    ParametroAlertaComponent,
    MenuComponent,
    SedeComponent,
    EmpresaComponent,
    RolComponent,
    MenuRolComponent,
    UsuarioComponent,
    UniversidadComponent,
    CicloComponent,
    AlumnoComponent
  ],
  imports: [
    CommonModule,
    MantenimientoRoutingModule,
    MatSelectModule,
    TableModule,
    SliderModule,
    ProgressBarModule,
    ToastModule,
    FormsModule,
    TagModule,
    DropdownModule,
    MultiSelectModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    CheckboxModule,
    InputTextareaModule,
    TreeSelectModule,
    RadioButtonModule,
    DialogModule,
    ReactiveFormsModule,
    InputNumberModule,
    TooltipModule,
    TabViewModule,
    PanelModule,
    TreeModule,
    SharedModule
  ]
})
export class MantenimientoModule { }
