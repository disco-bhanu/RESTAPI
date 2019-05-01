import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatTableDataSource } from '@angular/material';
import { Store } from '@ngrx/store';
import { SelectionModel } from '@angular/cdk/collections';
import { HeadersList } from '../shared/standard-headers';
import * as AppActions from '../store/app.actions';

export interface Header {
  key: string;
  value: string;
  comments: string;
  selected: boolean;
}

@Component({
  selector: 'app-global-headers',
  templateUrl: './global-headers.component.html',
  styleUrls: ['./global-headers.component.css']
})
export class GlobalHeadersComponent implements OnInit {

  header_key: string = null;
  header_value: string = null;
  header_comments: string = null;
  filterOptionsForHeaderKey: string[];
  filterOptionsForHeaderValue: string[];
  columns: string[] = ['select', 'key', 'value', 'comments'];
  headers = new MatTableDataSource<Header>();
  selection = new SelectionModel<Header>(true, []);

  constructor(public dialogRef: MatDialogRef<GlobalHeadersComponent>, public store: Store<{appStore: any}>) {}

  ngOnInit() {
    this.store.select(state => state.appStore.favHeaders).subscribe(
      header => {
        this.headers.data = [];
        header.map(h => {
          this.headers.data.push(h);
        });
        this.headers.data = [...this.headers.data];
      }
    );
    this.selection.changed.subscribe(
      change => {
        console.log(change);
        console.log(change.source.selected);
        const selectedFavHeaders = {};
        change.source.selected.reverse().forEach(ele => {
          if (selectedFavHeaders[ele.key] !== undefined) {
            this.selection.deselect(ele);
          } else {
            selectedFavHeaders[ele.key] = ele.value;
          }
        });
      }
    );
  }

  onAdd(): void {
    this.headers.data.push({
      key: this.header_key,
      value: this.header_value,
      comments: this.header_comments,
      selected: false
    });
    this.headers.data = [...this.headers.data];
    this.store.dispatch(new AppActions.FavHeaders(this.headers.data));
  }

  isAllSelected() {
    return this.selection.selected.length === this.headers.data.length;
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.headers.data.forEach(row => this.selection.select(row));
  }

  onSelect(e, i) {
    console.log(e);
    this.headers.data[i].selected = e.checked;
    this.selection.toggle(this.headers.data[i]);
    this.store.dispatch(new AppActions.FavHeaders(this.headers.data));
  }

  onHeadersKey(event) {
    this.filterOptionsForHeaderKey = HeadersList.keys.filter(key => key.toLowerCase().includes(event.target.value));
  }

  onHeadersValue(event) {
    this.filterOptionsForHeaderValue = HeadersList.values.filter(val => val.toLowerCase().includes(event.target.value));
  }

}
