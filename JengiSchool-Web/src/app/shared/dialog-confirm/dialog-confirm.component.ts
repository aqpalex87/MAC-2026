import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  ConfirmationService,
  MessageService,
  ConfirmEventType,
} from 'primeng/api';

@Component({
  selector: 'app-dialog-confirm',
  templateUrl: './dialog-confirm.component.html',
  styleUrls: ['./dialog-confirm.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class DialogConfirmComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {message:string},
    public dialogRef: MatDialogRef<DialogConfirmComponent>,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.confirmationService.confirm({
      message: this.data.message,
      icon: 'pi pi-comments',
      accept: () => {
        this.dialogRef.close(true);
      },
      reject: (type) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.dialogRef.close(false);
            break;
          case ConfirmEventType.CANCEL:
            this.dialogRef.close(false);
            break;
        }
      },
    });
  }

  closeDialog() {
    this.dialogRef.close(false);
  }
}
