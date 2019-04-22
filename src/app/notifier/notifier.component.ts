import { Component, Inject } from '@angular/core';

import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-notifier',
  templateUrl: './notifier.component.html',
  styleUrls: ['./notifier.component.css']
})
export class NotifierComponent {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: {message: string}, public snackBarRef: MatSnackBarRef<NotifierComponent>) { }

  onDismiss() {
    this.snackBarRef.dismiss();
  }

}
