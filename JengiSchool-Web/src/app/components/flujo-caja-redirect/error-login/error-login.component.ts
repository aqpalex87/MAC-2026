import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-error-login',
  templateUrl: './error-login.component.html',
  styleUrls: ['./error-login.component.css']
})
export class ErrorLoginComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<ErrorLoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mensaje }
  ) { }

  ngOnInit(): void {
  }

}
