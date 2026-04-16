import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './componentes/index/index.component';
import { DetalleComponent } from './componentes/detalle/detalle.component';
import { MenuComponent } from './componentes/menu/menu.component';
import { SedeComponent } from './componentes/sede/sede.component';
import { EmpresaComponent } from './componentes/empresa/empresa.component';
import { RolComponent } from './componentes/rol/rol.component';
import { MenuRolComponent } from './componentes/menu-rol/menu-rol.component';
import { UsuarioComponent } from './componentes/usuario/usuario.component';
import { UniversidadComponent } from './componentes/universidad/universidad.component';
import { CicloComponent } from './componentes/ciclo/ciclo.component';
import { AlumnoComponent } from './componentes/alumno/alumno.component';
import { GenerarCarnetComponent } from './componentes/generar-carnet/generar-carnet.component';

const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
  },
  {
    path: 'detalle',
    component: DetalleComponent
  },
  {
    path: 'menus',
    component: MenuComponent
  },
  {
    path: 'sedes',
    component: SedeComponent
  },
  {
    path: 'empresas',
    component: EmpresaComponent
  },
  {
    path: 'roles',
    component: RolComponent
  },
  {
    path: 'menu-roles',
    component: MenuRolComponent
  },
  {
    path: 'usuarios',
    component: UsuarioComponent
  },
  {
    path: 'universidades',
    component: UniversidadComponent
  },
  {
    path: 'ciclos',
    component: CicloComponent
  },
  {
    path: 'alumnos',
    component: AlumnoComponent
  },
  {
    path: 'carnets',
    component: GenerarCarnetComponent
  },
  {
    path: '**',
    redirectTo: 'index'
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MantenimientoRoutingModule { }
