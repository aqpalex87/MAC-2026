import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
 import { ConsultaComponent } from './componentes/consulta/consulta.component';
const routes: Routes = [
  {
    path: 'observar',
    component: ConsultaComponent,
  },
 
  //{ path: '', redirectTo: '/revisar', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsultarfcRoutingModule {}
