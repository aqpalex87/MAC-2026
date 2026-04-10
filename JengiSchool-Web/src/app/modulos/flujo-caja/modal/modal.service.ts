import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeudaDirecta, DeudaIndirecta } from 'src/app/models/flujocaja.interface';
import { DeudasPotencialIndirectasModalComponent } from './modal/deudas-potencial-indirectas-modal/deudas-potencial-indirectas-modal.component';
import { DeudasPotencialDirectasModalComponent } from './modal/deudas-potencial-directas-modal/deudas-potencial-directas-modal.component';
import { ModalDpdComponent } from '../componentes/flujo-caja-det/modals/modal-dpd/modal-dpd.component';
import { ModalDpiComponent } from '../componentes/flujo-caja-det/modals/modal-dpi/modal-dpi.component';
import { ModalEstablecerValorComponent } from '../componentes/flujo-caja-det/modals/modal-establecer-valor/modal-establecer-valor.component';
import { ErrorLoginComponent } from 'src/app/components/flujo-caja-redirect/error-login/error-login.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor(private dialog: MatDialog) { }

  abrirModalDeudaDirecta(deudadirecta: DeudaDirecta): MatDialogRef<DeudasPotencialDirectasModalComponent, DeudaDirecta> {
    return this.dialog.open(DeudasPotencialDirectasModalComponent, {
      width: '650px',
      data: { deudadirecta }
    });
  }

  abrirModalDeudaIndirectaDirecta(deudaindirecta: DeudaIndirecta): MatDialogRef<DeudasPotencialIndirectasModalComponent, DeudaIndirecta> {
    return this.dialog.open(DeudasPotencialIndirectasModalComponent, {
      width: '650px',
      data: { deudaindirecta }
    });
  }

  abrirFlujoCajaModalDPD(): MatDialogRef<ModalDpdComponent> {
    return this.dialog.open(ModalDpdComponent, {
      width: '650px',
      data: {}
    });
  }

  abrirFlujoCajaModalDPI(): MatDialogRef<ModalDpiComponent> {
    return this.dialog.open(ModalDpiComponent, {
      width: '650px',
      data: {}
    });
  }

  abrirModalEstablecerValorFC(): MatDialogRef<ModalEstablecerValorComponent> {
    return this.dialog.open(ModalEstablecerValorComponent, {
      width: '350px',
      data: {}
    });
  }

  abrirModalMensajeError(mensaje: string): MatDialogRef<ErrorLoginComponent> {
    return this.dialog.open(ErrorLoginComponent, {
      width: '350px',
      data: { mensaje }
    });
  }

}