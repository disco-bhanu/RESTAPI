import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import { APIService } from '../../shared/api.service';
import { HeadersList } from './standard-headers';

export interface Header {
  key: string;
  value: string;
  comments: string;
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
export class HeadersFavComponent implements OnInit {

  headersData = new MatTableDataSource<Header>();

  headerList: Header[] = [];
  header_key: string = null;
  header_value: string = null;
  header_comments: string = null;
  filterOptionsForHeaderKey: string[];
  filterOptionsForHeaderValue: string[];

  columns: string[] = ['select', 'key', 'value', 'comments'];

  selection = new SelectionModel<Header>(true, []);

  constructor(public dialogRef: MatDialogRef<HeadersFavComponent>, public APIservice: APIService) {}

  ngOnInit() {
    this.headerList = this.APIservice.favHeaders.map(h => {
      return {...h, checked: false};
    });

    this.APIservice.favHeaders.map(h => {
      this.headersData.data.push({...h, checked: false, comments: null});
    });
    this.headersData.data = [...this.headersData.data];
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onAdd(): void {
    this.headerList.push({
      key: this.header_key,
      value: this.header_value,
      comments: this.header_comments
    });
    this.headersData.data.push({
      key: this.header_key,
      value: this.header_value,
      comments: this.header_comments
    });
    this.headersData.data = [...this.headersData.data];
    this.APIservice.updateFavHeader({key: this.header_key, value: this.header_value, comments: this.header_comments});
    console.log(this.headerList);
    console.log(this.headersData);
  }


  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.headersData.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.headersData.data.forEach(row => this.selection.select(row));
  }

  onHeadersKey(event) {
    this.filterOptionsForHeaderKey = HeadersList.keys.filter(key => key.toLowerCase().includes(event.target.value));
  }

  onHeadersValue(event) {
    this.filterOptionsForHeaderValue = HeadersList.values.filter(val => val.toLowerCase().includes(event.target.value));
  }

}
