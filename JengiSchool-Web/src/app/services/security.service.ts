import { environment } from 'src/environments/environment';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AjaxResponse, ajax } from 'rxjs/ajax';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.interface';
import { DataSeguridad, DatosFC } from '../models/dataseguridad.interface';
import { Modulo } from '../models/modulo.interface';
import { DataLoginTokenExternal, LoginDto, ResponseLoginTokenExternal } from "../models/dataLoginTokenExternal";
import { MenuApi } from '../models/menu-api.interface';
import { normalizeMenuApiList } from 'src/app/shared/utils/menu-tree.util';
import { EmpresaAuth, SedeAuth } from '../models/empresa-sede.interface';

const UrlBase_SGSAPI = environment.UrlBase_SGSAPI;
const UrlBase_MACAPI = environment.UrlBase_MACAPI;
const APP_CODE = environment.AppCode;
const APP_KEY = environment.AppKey;


@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  //private TokenSGS! : string;
  public modulos: Modulo[] = [];
  public activarLoading: boolean = false;
  public descripcionPerfil$ = new EventEmitter<string>();

  constructor(private router: Router) { }

  public guardarToken(token: string): void {
    localStorage.setItem('tokenSGS', token);
  }

  public guardarPerfil(perfil: string) {
    localStorage.setItem("perfil", perfil);
  }

  public guardaridPerfil(idPerfil: string): void {
    localStorage.setItem('idperfil', idPerfil.toString());
  }

  public guardarIdEmpresa(idEmpresa: string): void {
    localStorage.setItem('idempresa', idEmpresa.toString());
  }

  public guardarDataSeguridad(data: DataSeguridad) {
    localStorage.setItem('vEmail', data.vEmail.toString());
    localStorage.setItem('vNombre', data.vNombre.toString());
    localStorage.setItem('UsuarioWeb', data.vUsuarioWeb.toString());
    localStorage.setItem('vDescripcionAgencia', data.vDescripcionAgencia.toString());
    localStorage.setItem('vEmpresa', (data.vEmpresa ?? '-').toString());
    localStorage.setItem('vSede', (data.vSede ?? '-').toString());
  }

  public guardarDatosFC(data: DatosFC) {
    localStorage.setItem('idFlujoCaja', data.idFlujoCaja.toString());
    localStorage.setItem('modo', data.modo.toString());
    localStorage.setItem('numeroDocumento', data.numeroDocumento.toString());
    localStorage.setItem('numeroSolicitud', data.numeroSolicitud.toString());
    localStorage.setItem('vista',data.vista.toString())
  }

  public leerDatosFC(): DatosFC {

    let datos = {} as DatosFC;
    if (localStorage.getItem("idFlujoCaja")) { datos.idFlujoCaja = +localStorage.getItem("idFlujoCaja") }
    if (localStorage.getItem("modo")) { datos.modo = localStorage.getItem("modo") }
    if (localStorage.getItem("numeroDocumento")) { datos.numeroDocumento = localStorage.getItem("numeroDocumento") }
    if (localStorage.getItem("numeroSolicitud")) { datos.numeroSolicitud = +localStorage.getItem("numeroSolicitud") }
    if (localStorage.getItem("vista")) { datos.vista = localStorage.getItem("vista") }
    return datos;
  }

  public leerTokenSeguridad(): any {

    let Token: any;

    if (localStorage.getItem('tokenSGS')) {
      Token = localStorage.getItem('tokenSGS');
    } else {
      Token = '';
    }

    return Token;
  }

  public leeridPerfil() {
    if (localStorage.getItem('idperfil')) {
      return localStorage.getItem('idperfil');
    } else {
      return '';
    }
  }

  public leerIdEmpresa() {
    if (localStorage.getItem('idempresa')) {
      return localStorage.getItem('idempresa');
    } else {
      return '';
    }
  }

  public leerUsuarioWeb(): any {

    let usuarioWeb: any;

    if (localStorage.getItem('UsuarioWeb')) {
      usuarioWeb = localStorage.getItem('UsuarioWeb');
    } else {
      usuarioWeb = '';
    }

    return usuarioWeb;
  }

  guardarTokenMAC(tokenMAC: string) {
    localStorage.setItem('tokenMAC', tokenMAC);
  }

  public leerEmail(): any {

    let email: any;

    if (localStorage.getItem('vEmail')) {
      email = localStorage.getItem('vEmail');
    } else {
      email = '';
    }

    return email;
  }

  public leerAgencia(): any {

    let agencia: any;

    if (localStorage.getItem('vDescripcionAgencia')) {
      agencia = localStorage.getItem('vDescripcionAgencia');
    } else {
      agencia = '';
    }

    return agencia;
  }

  public leerEmpresa(): any {
    let empresa: any;
    if (localStorage.getItem('vEmpresa')) {
      empresa = localStorage.getItem('vEmpresa');
    } else {
      empresa = '';
    }
    return empresa;
  }

  public leerSede(): any {
    let sede: any;
    if (localStorage.getItem('vSede')) {
      sede = localStorage.getItem('vSede');
    } else {
      sede = '';
    }
    return sede;
  }

  public leerNombreUsuario(): any {

    let nombreUsuario: any;

    if (localStorage.getItem('vNombre')) {
      nombreUsuario = localStorage.getItem('vNombre');
    } else {
      nombreUsuario = '';
    }

    return nombreUsuario;
  }

  public autenticarMAC(): Observable<any> {

    let email = this.leerEmail();
    let usuarioWeb = this.leerUsuarioWeb();
    let nombreUsuario = this.leerNombreUsuario();
    let perfil = this.leerPerfil();
    let agencia = this.leerAgencia();

    let filtros = {
      correoelectronico: email,
      nombreusuario: nombreUsuario,
      codigousuario: usuarioWeb,
      numerodocumento: usuarioWeb,
      perfil,
      agencia
    };

    const headers = {
      'Content-Type': 'application/json',
      'X-AppKey': `${APP_KEY}`,
      'X-AppCode': `${APP_CODE}`
    }

    const req = ajax.post(`${UrlBase_MACAPI}/acceso`, filtros, headers);

    const data$ = new Observable(observer => {
      req.subscribe(
        (res) => {
          observer.next(res);
          observer.complete();
        },
        (err) => {
          observer.error(err);
        }
      );
    });

    return data$;
  }

  public validarToken(): Observable<any> {
    const headers = this.getHeadersSgs();
    const req = ajax.get(`${UrlBase_SGSAPI}/validate/token`, headers);

    const data$ = new Observable(observer => {
      req.subscribe(
        (res) => {
          observer.next(res);
          observer.complete();
        },
        (err) => {
          observer.error(err);
        }
      );
    });

    return data$;
  }

  public validarTokenPromise() {
    const headers = this.getHeadersSgs();
    return ajax.get(`${UrlBase_SGSAPI}/validate/token`, headers).toPromise();

  }

  public obtenerModulosPromise() {
    const headers = this.getHeadersSgs();
    let idPerfil = this.leeridPerfil();
    let usuarioWeb = this.leerUsuarioWeb();

    return ajax.get(`${UrlBase_SGSAPI}/modulo/obtenermodulos/${idPerfil}/${usuarioWeb}`, headers).toPromise();

  }



  public obtenerModulos(): Observable<any> {
    const headers = this.getHeadersSgs();
    let idPerfil = this.leeridPerfil();
    let usuarioWeb = this.leerUsuarioWeb();

    const req = ajax.get(`${UrlBase_SGSAPI}/modulo/obtenermodulos/${idPerfil}/${usuarioWeb}`, headers);

    const data$ = new Observable(observer => {
      req.subscribe(
        (res) => {
          observer.next(res);
          observer.complete();
        },
        (err) => {
          observer.error(err);
        }
      );
    });

    return data$;
  }

  public guardarModulos(data: Modulo[]) {
    localStorage.setItem('modulos', JSON.stringify(data));
  }

  public leerModulos() {
    let modulos: any;
    var item = localStorage.getItem('modulos');
    if (item != null) {
      modulos = JSON.parse(item);
    } else {
      modulos = null;
    }

    return modulos;
  }

  leerTokenMAC() {
    let tokenMAC: any;

    if (localStorage.getItem('tokenMAC')) {
      tokenMAC = localStorage.getItem('tokenMAC');
    } else {
      tokenMAC = '';
    }

    return tokenMAC;
  }

  public tienePermisoModulo(): boolean {
    return true;
  }

  public redirectLogin(): void {
    void this.router.navigate(['/login'], { replaceUrl: true });
  }

  public obtenerUsuario(filtro: Usuario): Observable<any> {
    const headers = this.getHeadersSgs();
    const req = ajax.post(`${UrlBase_SGSAPI}/usuario/obtenerusuario`, filtro, headers);

    const data$ = new Observable(observer => {
      req.subscribe(
        (res) => {
          observer.next(res);
          observer.complete();
        },
        (err) => {
          observer.error(err);
        }
      );
    });

    return data$;
  }

  public cerrarSesion() {
    localStorage.removeItem('vNombre');
    localStorage.removeItem('idperfil');
    localStorage.removeItem('idempresa');
    localStorage.removeItem('UsuarioWeb');
    localStorage.removeItem('tokenMAC');
    localStorage.removeItem('tokenSGS');
    localStorage.removeItem('vEmail');
    localStorage.removeItem('vDescripcionAgencia');
    localStorage.removeItem('vEmpresa');
    localStorage.removeItem('vSede');
    localStorage.removeItem('modulos');
    localStorage.removeItem('menusApi');
  }

  public leerPerfil() {
    if (localStorage.getItem('perfil')) {
      return localStorage.getItem('perfil');
    } else {
      return '';
    }
  }
  //----------------------------//

  public getTokenMAC() {
    return <string>localStorage.getItem("tokenMAC");
  }

  public loginApi(usuario: string, password: string) {
    return ajax.post(`${UrlBase_MACAPI}/auth/login`, { usuario, password }, {
      'Content-Type': 'application/json'
    });
  }

  public obtenerEmpresasApi() {
    return ajax.get<EmpresaAuth[]>(`${UrlBase_MACAPI}/auth/empresas`, {
      'Content-Type': 'application/json'
    });
  }

  public obtenerSedesPorEmpresaApi(idEmpresa: number) {
    return ajax.get<SedeAuth[]>(`${UrlBase_MACAPI}/sedes/empresa/${idEmpresa}`, {
      'Content-Type': 'application/json'
    });
  }

  public obtenerMenusApi() {
    const token = this.leerTokenMAC();
    return ajax.get<MenuApi[]>(`${UrlBase_MACAPI}/auth/menus`, {
      'Content-Type': 'application/json',
      'Authorization': `${token}`
    });
  }

  public guardarMenusApi(data: MenuApi[]) {
    localStorage.setItem('menusApi', JSON.stringify(data ?? []));
  }

  public leerMenusApi(): MenuApi[] {
    const item = localStorage.getItem('menusApi');
    if (!item) {
      return [];
    }
    try {
      const raw = JSON.parse(item) as unknown;
      return normalizeMenuApiList(Array.isArray(raw) ? raw : []);
    } catch {
      return [];
    }
  }

  public loginTokenExternal(dataLoginExternal: DataLoginTokenExternal) {
    return ajax.post<LoginDto<ResponseLoginTokenExternal>>(`${UrlBase_MACAPI}/FlujoCaja/loginToken`, dataLoginExternal);
  }

  public obtenerPerfilesAplicacion(usuarioWeb: string, urlAplicacion: string) {
    const headers = this.getHeadersSgs();
    return ajax.get(`${UrlBase_SGSAPI}/perfil/obtenerPerfilesAplicacion?usuarioWeb=${usuarioWeb}&urlAplicacion=${urlAplicacion}`, headers)
  }

  private getHeadersSgs() {
    let tokenSGS = this.leerTokenSeguridad();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenSGS}`
    };
  }

}
