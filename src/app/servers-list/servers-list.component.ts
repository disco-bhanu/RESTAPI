import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatDialogRef } from '@angular/material';
import { APIService } from '../shared/api.service';
import { Store } from '@ngrx/store';
import * as AppActions from '../store/app.actions';

export interface List {
  name: string;
  set: boolean;
}

@Component({
  selector: 'app-servers-list',
  templateUrl: './servers-list.component.html',
  styleUrls: ['./servers-list.component.css']
})
export class ServersListComponent implements OnInit {
  list = [
    { name: 'abc', set: false },
    { name: 'def', set: false },
    { name: 'ghi', set: false },
    { name: 'jkl', set: false }
  ];

  columns = ['server', 'set'];

  serverslist = new MatTableDataSource<List>();

  selectedIndex;

  constructor(
    public apiService: APIService,
    public serverListDialogRef: MatDialogRef<ServersListComponent>,
    public store: Store<{ appStore: any }>
  ) {}

  ngOnInit() {
    this.serverslist.data = [...this.list];
  }

  onSelect(idx) {
    this.selectedIndex = idx;
  }

  toCurrentTab() {
    this.store.dispatch(
      new AppActions.OverrideHost({
        check: true,
        hostname: this.serverslist.data[this.selectedIndex].name
      })
    );
    this.serverListDialogRef.close();
  }

  toAllTabs() {
    this.store.dispatch(
      new AppActions.OverrideHost({
        check: false,
        hostname: this.serverslist.data[this.selectedIndex].name
      })
    );
    this.serverListDialogRef.close();
  }
}
