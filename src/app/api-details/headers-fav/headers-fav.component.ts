import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { APIService } from '../../shared/api.service';

export interface Header {
  key: string;
  value: string;
  checked: boolean;
}

export interface HeadersData {
  sysid: string;
  srvid: string;
}

@Component({
  selector: 'app-headers-fav',
  templateUrl: './headers-fav.component.html',
  styleUrls: ['./headers-fav.component.css']
})
export class HeadersFavComponent {

  constructor(public dialogRef: MatDialogRef<HeadersFavComponent>,
    @Inject(MAT_DIALOG_DATA) public data: HeadersData,
    public APIservice: APIService
    ) {
      this.headerList = this.APIservice.favHeaders.map(h => {
        return {...h, checked: false};
      });
    }

  headerList: Header[] = [];
  header_key: string = null;
  header_value: string = null;
  filtered_headers = [];

  onNoClick(): void {
    this.dialogRef.close();
  }

  onOk(): void {
    console.log(this.data);
  }

  onAdd(): void {
    this.headerList.push({
      key: this.header_key,
      value: this.header_value,
      checked: false
    });
    this.APIservice.updateFavHeader({key: this.header_key, value: this.header_value});
    console.log(this.headerList);
  }

  onSelect(idx): void {
    this.headerList[idx].checked = !this.headerList[idx].checked;
    this.filtered_headers = this.headerList.filter(h => h.checked === true);
  }

}
