import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-msg-error',
  templateUrl: './msg-error.component.html',
  styleUrls: ['./msg-error.component.css']
})
export class MsgErrorComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { message: string; },
    public dialogRef: MatDialogRef<MsgErrorComponent>
  ) { }

}
