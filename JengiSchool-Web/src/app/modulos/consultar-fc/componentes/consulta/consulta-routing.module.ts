import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlujoCajaConsultaComponent } from 'src/app/modulos/flujo-caja/componentes/consulta/consulta.component';
import { EsfaComponent } from 'src/app/modulos/flujo-caja/componentes/esfa/esfa.component';
import { GufComponent } from 'src/app/modulos/flujo-caja/componentes/guf/guf.component';
import { FlujoCajaReporteComponent } from 'src/app/modulos/flujo-caja/componentes/reporte/reporte.component';

const routes: Routes = [
  {
    path: 'guf',
    component: GufComponent
  },
  {
    path: 'esfa',
    component: EsfaComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaRoutingModule { }
