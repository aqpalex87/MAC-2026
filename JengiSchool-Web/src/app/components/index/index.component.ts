import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { SecurityService } from 'src/app/services/security.service';
import { Usuario } from 'src/app/models/usuario.interface';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexComponent implements OnInit {
  private usuario: Usuario;
  constructor(private router: ActivatedRoute
    , private _router: Router
    , private securityService: SecurityService) { }

  ngOnInit(): void {
    this.router.queryParamMap.subscribe((result: ParamMap) => {
      const pToken: string | null = result.get('Token');
      const pIdPerfil: string | null = result.get('IdPerfil');
      if (pToken == null || pIdPerfil == null) {
        this._router.navigate(['error']);
      }
      this.saveTokenSgs(pToken, pIdPerfil);
    });

    this.securityService.obtenerUsuario(this.usuario).subscribe({
      next: data => {
        let response = data.response;
        this.securityService.guardarDataSeguridad(response);
        this.usuario.UsuarioWeb = response.vUsuarioWeb;
        this.securityService.autenticarMAC().subscribe({
          next: result => {
            let tokenMAC = result.xhr.getResponseHeader("authorization");
            this.securityService.guardarTokenMAC(tokenMAC);
            window.location.href = environment.UrlBase_MAC;
          },
          error: () => {
            this._router.navigate(['error']);
          }
        });
        this._router.navigate(['/']);
      },
      error: () => {
        this._router.navigate(['error']);
      }
    });
  }

  private saveTokenSgs(pToken: string, pIdPerfil: string) {
    this.usuario = {
      Token: pToken,
      idPerfil: pIdPerfil,
      UsuarioWeb: '',
    };
    this.securityService.guardarToken(pToken);
    this.securityService.guardaridPerfil(pIdPerfil);
  }
}
