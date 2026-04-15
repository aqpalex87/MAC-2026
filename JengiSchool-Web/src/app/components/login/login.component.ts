import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SecurityService } from 'src/app/services/security.service';
import { DataSeguridad } from 'src/app/models/dataseguridad.interface';
import { ToastrService } from 'ngx-toastr';
import { timeout } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  codigoUsuario = '';
  password = '';
  empresa = '';
  sede = '';
  loading = false;
  private returnUrl = '/home';

  constructor(
    private securityService: SecurityService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.route.queryParams.subscribe((p) => {
      if (p['returnUrl']) {
        this.returnUrl = p['returnUrl'];
      }
    });
  }

  ngOnInit(): void {
    if (this.securityService.leerTokenMAC()) {
      void this.router.navigateByUrl(this.returnUrl || '/home');
    }
  }

  iniciarSesion(): void {
    const c = this.codigoUsuario?.trim();
    if (!c || !this.password) {
      this.toastr.warning('Ingrese usuario y contraseña.', 'Datos incompletos');
      return;
    }

    this.loading = true;
    this.securityService.loginApi(c, this.password).pipe(timeout(15000)).subscribe({
      next: (result: any) => {
        const response = result.response;
        const token = response?.token || result.xhr?.getResponseHeader?.('authorization');
        if (!token) {
          this.loading = false;
          this.toastr.error('No se recibió token de autenticación.', 'Error');
          return;
        }

        this.securityService.guardarTokenMAC(token);
        this.securityService.guardaridPerfil(String(response?.idRol ?? '1'));
        this.securityService.guardarPerfil(response?.rol ?? 'Usuario');

        const data: DataSeguridad = {
          vEmail: `${c}@local`,
          vNombre: response?.usuario ?? c,
          vUsuarioWeb: response?.usuario ?? c,
          vDescripcionAgencia: '-',
          vEmpresa: this.empresa?.trim() || 'Empresa Principal',
          vSede: this.sede?.trim() || 'Sede Central',
        };
        this.securityService.guardarDataSeguridad(data);

        this.securityService.obtenerMenusApi().pipe(timeout(15000)).subscribe({
          next: (menusRes: any) => {
            this.securityService.guardarMenusApi(menusRes.response ?? []);
            this.loading = false;
            this.toastr.success('Bienvenido', 'Sesion iniciada');
            void this.router.navigateByUrl(this.returnUrl || '/home');
          },
          error: () => {
            this.loading = false;
            this.toastr.error('No se pudieron cargar los menus (timeout o error de red).', 'Error');
          }
        });
      },
      error: () => {
        this.loading = false;
        this.toastr.error('No se pudo iniciar sesión (credenciales, timeout o red).', 'Error de acceso');
      },
    });
  }
}
