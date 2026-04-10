import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { SecurityService } from "../../services/security.service";
import { DataLoginTokenExternal, LoginDto, ResponseLoginTokenExternal } from "../../models/dataLoginTokenExternal";
import { environment } from "../../../environments/environment";
import { GlobalConstants } from "../../shared/common/globalContants";
import { DataSeguridad, DatosFC } from 'src/app/models/dataseguridad.interface';
import { ModalService } from 'src/app/modulos/flujo-caja/modal/modal.service';
import Swal from 'sweetalert2';
import { Modulo } from 'src/app/models/modulo.interface';
import { DomService } from 'src/app/dom.service';

const UrlBase_MACAPI = environment.UrlBase_MACAPI;
const UrlBase_SGSAPI = environment.UrlBase_SGSAPI;

@Component({
  selector: 'app-flujo-caja-redirect',
  templateUrl: './flujo-caja-redirect.component.html',
  styleUrls: ['./flujo-caja-redirect.component.css']
})
export class FlujoCajaRedirectComponent implements OnInit {

  loading: boolean;

  constructor(
    private routerActived: ActivatedRoute,
    private modalService: ModalService,
    private securityService: SecurityService,
    private router: Router,
    private domService: DomService,
  ) { }

  ngOnInit(): void {

    localStorage.clear()
    this.loading = true
    const token = this.routerActived.snapshot.params['token'];
    this.loginToken(token)
  }

  loginToken(token: string) {
    this.domService.ShowLoading();
    this.securityService.cerrarSesion();
    const dataExternal: DataLoginTokenExternal = {
      token: token,
      estado: "0",
      urlApiAutenticate: UrlBase_SGSAPI + "/acceso/authenticate",
      urlApiObtenerUsuario: UrlBase_SGSAPI + "/usuario/obtenerusuario"
    }

    this.securityService.loginTokenExternal(dataExternal).subscribe(res => {
      if (res.response.codigo == GlobalConstants.FlujoCajaLoginTokenSuccess) {
        const data = res.response.response
        this.securityService.guardarToken(data.vToken);
        this.securityService.guardarPerfil(data.vPerfilDescripcion)

        let response: ResponseLoginTokenExternal = res.response.response

        this.securityService.obtenerPerfilesAplicacion(data.vUsuarioWeb, location.origin).subscribe((res: any) => {
          if (res.response.ListUsuarioPerfil.length > 0) {
            const application = res.response.ListUsuarioPerfil.filter(item => {
              return item.NombreAplicacion.includes(environment.ApplicationName)
            })[0]
            if (application) {

              this.securityService.guardaridPerfil(application.IdPerfil)
              this.securityService.guardarDataSeguridad(response);


              this.securityService.autenticarMAC().subscribe((result: any) => {
                let tokenMAC = result.xhr.getResponseHeader("authorization");
                this.securityService.guardarTokenMAC(tokenMAC);

                this.securityService.obtenerModulos().subscribe(
                  (result: any) => {
                    var modulos = result.response as Modulo[];
                    var urlExist = "";
                    var modo = "";
                    switch (data.vOpcion) {
                      case GlobalConstants.Registrar_EditarFC:
                        urlExist = "solicitud-credito/consulta";
                        modo = data.vIdFC > 0 ? "EDITAR" : "NUEVO";
                        break;
                      case GlobalConstants.RevisarFC:
                        urlExist = "flujo-caja/revisar";
                        modo = "DETALLE";
                        break;
                      case GlobalConstants.ConsultarFC:
                        urlExist = "flujo-caja/consulta";
                        modo = "DETALLE";
                        break;
                    }

                    const modulo = modulos.filter(item => {
                      return item.Controller != null ? item.Controller.includes(urlExist) : null;
                    })[0]

                    if (modulo) {

                      let datos: DatosFC = {
                        idFlujoCaja: data.vIdFC,
                        modo: modo,
                        numeroDocumento: data.vNumDocumento,
                        numeroSolicitud: +data.vSolCredito,
                        vista: data.vOpcion == '01' ? 'FC' : 'RE'
                      }
                      this.securityService.guardarDatosFC(datos);
                      switch (data.vOpcion) {
                        case GlobalConstants.Registrar_EditarFC:
                          window.location.href = `${environment.UrlBase_MAC}/flujocaja`;
                          break;
                        case GlobalConstants.RevisarFC:
                          window.location.href = `${environment.UrlBase_MAC}/flujo-caja/observar`;
                          break;
                        case GlobalConstants.ConsultarFC:
                          window.location.href = `${environment.UrlBase_MAC}/consultaflujocaja`;
                          break;
                        default:
                          Swal.fire({
                            icon: 'error',
                            confirmButtonText: "Aceptar",
                            text: 'El usuario no tiene acceso a la opción solicitada.',
                            timer: 3000
                          }).then((result) => {
                            window.location.href = `${environment.UrlBase_MAC}/home`;
                          });
                          break;
                      }
                    } else {
                      Swal.fire({
                        icon: 'error',
                        confirmButtonText: "Aceptar",
                        text: 'El usuario no tiene acceso a la opción solicitada.',
                        timer: 3000
                      }).then((result) => {
                        window.location.href = `${environment.UrlBase_MAC}/home`;
                      });
                    }
                  }, (error) => {
                    Swal.fire({
                      icon: 'error',
                      text: 'El usuario no tiene acceso a la opción solicitada.',
                      confirmButtonText: "Aceptar",
                      timer: 3000
                    }).then((result)=>{
                      window.location.href = `${environment.UrlBase_MAC}/home`;
                    });
                  })
              }, (error) => {
                Swal.fire({
                  icon: 'error',
                  confirmButtonText: "Aceptar",
                  text: 'Ha ocurrido un error, intentelo mas tarde',
                  timer: 3000
                });
              })
            } else {
              Swal.fire({
                icon: 'error',
                confirmButtonText: "Aceptar",
                text: 'El usuario no tiene acceso a la opción solicitada.',
                timer: 3000
              }).then((result)=>{
                window.location.href = `${environment.UrlBase_MAC}/home`;
              });
            }

          } else {
            Swal.fire({
              icon: 'error',
              confirmButtonText: "Aceptar",
              text: 'El usuario no tiene acceso a la opción solicitada.',
              timer: 3000
            }).then((result)=>{
              window.location.href = `${environment.UrlBase_MAC}/home`;
            });
          }

        })
      } else {
        Swal.fire({
          icon: 'error',
          confirmButtonText: "Aceptar",
          text: 'Acceso Denegado.',
          timer: 3000
        });
      }

    }, err => {
      Swal.fire({
        icon: 'error',
        confirmButtonText: "Aceptar",
        text: 'Ha ocurrido un error, intentelo mas tarde',
        timer: 3000
      });
    })

    this.domService.HideLoading();
  }

}
