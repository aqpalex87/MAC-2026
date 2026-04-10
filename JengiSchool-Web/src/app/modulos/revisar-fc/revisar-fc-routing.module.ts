import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RevisarComponent } from './componentes/revisar/revisar.component';
 const routes: Routes = [
  {
    path: 'revisar',
    component: RevisarComponent,
  },
 
  //{ path: '', redirectTo: '/revisar', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RevisarfcRoutingModule {}
