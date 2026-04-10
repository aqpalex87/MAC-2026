import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogModule } from 'primeng/dialog';
import { MsgSucessComponent } from './shared/msg-sucess/msg-sucess.component';
import { MsgErrorComponent } from './shared/msg-error/msg-error.component';
import { DialogConfirmComponent } from './shared/dialog-confirm/dialog-confirm.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { TableComponent } from './modulos/flujo-caja/table/table.component';
import { ModalComponent } from './modulos/flujo-caja/modal/modal.component';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { appReducers } from './app.state';
import { environment } from 'src/environments/environment';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FlujoCajaModule } from './modulos/flujo-caja/flujo-caja.module';
import { BasicAuthInterceptor } from './services/interceptors/basic-auth.interceptor';
import { FlujoCajaRedirectComponent } from './components/flujo-caja-redirect/flujo-caja-redirect.component';
import { ErrorLoginComponent } from "./components/flujo-caja-redirect/error-login/error-login.component";
import { ToastrModule } from 'ngx-toastr';
import { SharedModule } from './shared/shared.module';
import { LoadingComponent } from './shared/loading/loading.component';

 @NgModule({
  declarations: [
    AppComponent,
    DialogConfirmComponent,
    MsgSucessComponent,
    MsgErrorComponent,
    HomeComponent,
    NavbarComponent,
    SidebarComponent,
    TableComponent,
    ModalComponent,
    FlujoCajaRedirectComponent,
    ErrorLoginComponent,
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule,
    DialogModule,
    MatDialogModule,
    MatFormFieldModule,
    ConfirmDialogModule,
    FlujoCajaModule,
    SharedModule,
    StoreModule.forRoot(appReducers, {
      runtimeChecks: {
        strictStateImmutability: false,
        strictActionImmutability: false,
      }
    } ),
    StoreDevtoolsModule.instrument({
      maxAge: 100,
      logOnly: environment.production,
    }),
    ToastrModule.forRoot({
      timeOut: 3000
    }),
  ],
  providers: [
    AuthGuard,
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
    { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
