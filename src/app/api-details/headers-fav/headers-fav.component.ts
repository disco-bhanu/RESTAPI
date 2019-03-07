import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-headers-fav',
  templateUrl: './headers-fav.component.html',
  styleUrls: ['./headers-fav.component.css']
})
export class HeadersFavComponent {

  constructor(public dialogRef: MatDialogRef<HeadersFavComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
