import { Injectable } from '@angular/core';
import { DialogConfirmComponent } from 'src/app/shared/dialog-confirm/dialog-confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { MsgSucessComponent } from 'src/app/shared/msg-sucess/msg-sucess.component';
import { MsgErrorComponent } from 'src/app/shared/msg-error/msg-error.component';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog, private router:Router) { }

  openConfirmDialog(msg:string){
    return this.dialog.open(DialogConfirmComponent,{
    //  width: '390px',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      data :{
        message : msg
      }
    });
  }

  openMsgSuccessDialog(msg:string){
    return this.dialog.open(MsgSucessComponent,{
      width: '390px',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      data :{
        message : msg
      },
      
    });
  }

  
  openMsgSuccessDialogWithActionRedirect(msg:string, action:string){
    const dialogRef = this.dialog.open(MsgSucessComponent, {
      width: '390px',
      data: {message: msg}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate([action]);
    });
  }

  openMsgErrorDialog(msg:string){
    return this.dialog.open(MsgErrorComponent,{
      width: '390px',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      data :{
        message : msg
      }
    });
  }

}
