import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface HeadersData {
  key: string;
  value: string;
}

@Component({
  selector: 'app-headers-fav',
  templateUrl: './headers-fav.component.html',
  styleUrls: ['./headers-fav.component.css']
})
export class HeadersFavComponent {

  constructor(public dialogRef: MatDialogRef<HeadersFavComponent>,
    @Inject(MAT_DIALOG_DATA) public data: HeadersData) { }

  headerList: HeadersData[] = [];
  header_key: string = null;
  header_value: string = null;

  onNoClick(): void {
    this.dialogRef.close();
  }

  onAdd(): void {
    this.headerList.push({
      key: this.header_key,
      value: this.header_value
    });
    console.log(this.headerList);
  }

}
