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

  columns = ['server', 'set'];

  serversList = new MatTableDataSource<List>();

  selectedIndex;

  constructor(
    public apiService: APIService,
    public serverListDialogRef: MatDialogRef<ServersListComponent>,
    public store: Store<{ appStore: any }>
  ) {}

  ngOnInit() {
    this.apiService.fetchServersList().subscribe(
      list => this.serversList.data = [...list]
    );
  }

  onSelect(idx) {
    this.selectedIndex = idx;
  }

  toCurrentTab() {
    this.store.dispatch(
      new AppActions.OverrideHost({
        check: true,
        hostname: this.serversList.data[this.selectedIndex].name
      })
    );
    this.serverListDialogRef.close();
  }

  toAllTabs() {
    this.store.dispatch(
      new AppActions.OverrideHost({
        check: false,
        hostname: this.serversList.data[this.selectedIndex].name
      })
    );
    this.serverListDialogRef.close();
  }
}
