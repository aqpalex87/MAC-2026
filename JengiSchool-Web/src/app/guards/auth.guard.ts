import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Router } from '@angular/router';
import { Modulo } from '../models/modulo.interface';
import { DomService } from '../services/dom.service';
import { SecurityService } from '../services/security.service';
import { JwtHelperService } from "@auth0/angular-jwt";
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthGuard implements CanActivate {

    public loader = false;
    constructor(
        private securityService: SecurityService,
        private router: Router,
        private domService: DomService,
        private toastr: ToastrService
    ) { }
    
    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Promise<boolean>
    {
        const tokenSGS = this.securityService.leerTokenSeguridad();
        this.loader=true;
        this.domService.ShowLoading();

        if (!tokenSGS) {
            this.toastr.error('Token expirado, vuelva a iniciar sesión.', 'Error');
            this.securityService.redirectLogin();
            return false;
        }

        const helper = new JwtHelperService();

        if(tokenSGS && helper.isTokenExpired(tokenSGS)){
            this.toastr.error('Token expirado, vuelva a iniciar sesión.', 'Error');
            this.securityService.cerrarSesion();

            setTimeout(() => {
                this.securityService.redirectLogin();
            }, 3000);

            return false;                
        }

        const tokenMAC = this.securityService.leerTokenMAC();
        const rawTokenMAC = String(tokenMAC).substring(7);

        if(tokenMAC && helper.isTokenExpired(rawTokenMAC)){
            this.toastr.error('Token expirado, vuelva a iniciar sesión.', 'Error');
            this.securityService.cerrarSesion();

            setTimeout(() => {
                this.securityService.redirectLogin();
            }, 3000);

            return false;                
        }
 
        await this.securityService.obtenerModulosPromise().then(
            (result: any) => {
                //Se valida si entre los modulos que se obtiene, se cuenta con el modulo al cual se quiere acceder
                var modulos = result.response as Modulo[];
                var valido: boolean = false;
                var ruta = state.url; // document.location.href;

                var acceso = ruta;//.substr(ruta.lastIndexOf("/"), ruta.length).replace("/", "")
                if (acceso == "error" || acceso == "AccesoInvalido") {
                    this.securityService.guardarModulos(modulos);
                    this.domService.HideLoading();
                    return true;
                }
                
                if (acceso.toUpperCase().includes("HOME") ||
                    acceso.toUpperCase().includes("REDIRECT") ||
                    acceso.toUpperCase().includes("INDEX") ||
                    acceso.toUpperCase().includes("VIEW") ||
                    acceso.toUpperCase().includes("DET")

                ) {

                    this.securityService.guardarModulos(modulos);
                    this.domService.HideLoading();
                    return true;
                
                } else {        
                    for (let i = 0; i < modulos.length; i++) {
                        const element = modulos[i];
                        let accesoTmp = '';
                        if (element.TipoOpcion == '1' || element.TipoOpcion == '2') {
                            accesoTmp = element.UrlOpcion.substr(ruta.lastIndexOf("/"), ruta.length).replace("/", "")
                        }
                        if (element.TipoOpcion == '3') {
                            if(element.Action!=null)
                            accesoTmp = element.Action;
                        else
                        accesoTmp = element.Controller;
                        }
                        if (acceso.toUpperCase().includes(accesoTmp.toUpperCase())) {
                            valido = true;
                            break;
                        }
                    }
                }

                if (valido) {
                    this.securityService.guardarModulos(modulos);
                    this.domService.HideLoading();
                    return true;
                } else {

                    this.router.navigate(['error']);
                    this.domService.HideLoading();
                    return false;
                }

            },
            (error: any) => {
                this.toastr.error('Token expirado, vuelva a iniciar sesión.', 'Error');
                this.securityService.cerrarSesion();
                this.securityService.redirectLogin();
                this.domService.HideLoading();
                return false;
            });

        return true;
    }    
}