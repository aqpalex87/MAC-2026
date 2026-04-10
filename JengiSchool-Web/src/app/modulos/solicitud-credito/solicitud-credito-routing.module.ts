import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SolicitudCreditoConsultaComponent } from './componentes/consulta/consulta.component';

const routes: Routes = [
  {
    path: 'consulta',
    component: SolicitudCreditoConsultaComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolicitudCreditoRoutingModule { }
