import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GufComponent } from './componentes/guf/guf.component';
import { EsfaComponent } from './componentes/esfa/esfa.component';
import { FlujoCajaConsultaComponent } from './componentes/consulta/consulta.component';
import { FlujoCajaReporteComponent } from './componentes/reporte/reporte.component';

const routes: Routes = [
  {
    path: 'guf',
    component: GufComponent
  },
  {
    path: 'esfa',
    component: EsfaComponent
  },
  {
    path: 'consulta',
    component: FlujoCajaConsultaComponent
  },
  {
    path: 'reporte',
    component: FlujoCajaReporteComponent
  }

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlujoCajaRoutingModule { }
