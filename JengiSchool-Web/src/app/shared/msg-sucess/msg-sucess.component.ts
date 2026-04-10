import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-msg-success',
  templateUrl: './msg-sucess.component.html',
  styleUrls: ['./msg-sucess.component.css']
})
export class MsgSucessComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { message: string; },
    public dialogRef: MatDialogRef<MsgSucessComponent>
  ) { }

}
