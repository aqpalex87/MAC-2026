import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { FlujoCajaComponent } from './modulos/flujo-caja/flujo-caja.component';
import { TableComponent } from './modulos/flujo-caja/table/table.component';
import {FlujoCajaRedirectComponent} from "./components/flujo-caja-redirect/flujo-caja-redirect.component";
import {ErrorLoginComponent} from "./components/flujo-caja-redirect/error-login/error-login.component";
import { IndexComponent } from './components/index/redirect/index/index.component';
import { LoginComponent } from './components/login/login.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path:'flujocaja', component:FlujoCajaComponent,

  },
  {
    path:'consultaflujocaja', component:FlujoCajaComponent,

  },
  {
    path:'flujocaja/tabla', component:TableComponent,

  },
  {
    path: 'mantenimiento-parametros',
    canActivate:[AuthGuard],
    loadChildren: () =>
      import('./modulos/mantenimiento/mantenimiento.module').then(
        (authentication) => authentication.MantenimientoModule
      ),
  },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  {
    path: 'solicitud-credito',
    canActivate:[AuthGuard],
    loadChildren: () =>
      import('./modulos/solicitud-credito/solicitud-credito.module').then(
        (auth) => auth.SolicitudCreditoModule
      ),
  },
  {
    path: 'flujo-caja',
    canActivate:[AuthGuard],
    loadChildren: () =>
      import('./modulos/revisar-fc/revisar-fc.module').then(
        (auth) => auth.RevisarfcModule
      ),
  },
  {
    path: 'flujo-caja',
    canActivate:[AuthGuard],
    loadChildren: () =>
      import('./modulos/consultar-fc/consulta-fc.module').then(
        (auth) => auth.ConsultarfcModule
      ),
  },
   
  {
    path: 'flujo-caja',
    canActivate:[AuthGuard],
    loadChildren: () =>
      import('./modulos/flujo-caja/flujo-caja.module').then(
        (auth) => auth.FlujoCajaModule
      ),
  },
  { path: 'Redirect/Index', component: IndexComponent },
  { path: 'error-token', component: ErrorLoginComponent },
  { path: ':token', component: FlujoCajaRedirectComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'login' },
  /*{
    path: '',
    pathMatch: 'full',
    redirectTo: '',
  },*/
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
