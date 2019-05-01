import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatDialogRef } from '@angular/material';
import { APIService } from '../shared/api.service';
import { Store } from '@ngrx/store';
import * as AppActions from '../store/app.actions';
import {FormControl} from '@angular/forms';

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

  validate = false;

  constructor(
    public apiService: APIService,
    public serverListDialogRef: MatDialogRef<ServersListComponent>,
    public store: Store<{ appStore: any }>
  ) {}

  ngOnInit() {
    this.apiService.fetchServersList().subscribe(
      list => {
        this.serversList.data = list.reduce( (a, c) => [...a, {name: c, set: false}], []);
      }
      // this.serversList.data = [...list]
    );
  }

  onSelect(idx) {
    this.selectedIndex = idx;
  }

  onCheck(idx) {
    this.onSelect(idx);
    const temp = [...this.serversList.data];
    this.serversList.data = [];
    temp.forEach((d, i) => {
      i === idx ? temp[i].set = true : temp[i].set = false;
    });
    this.serversList.data = [...temp];
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

  onAdd(e) {
    console.log(e.value);
    if (e.value === null || e.value.trim().length === 0) {
      this.validate = true;
    } else {
      this.validate = false;
      const addServer = [...this.serversList.data, {name: e.value, set: false}];
      this.apiService.addServer(e.value);
      this.serversList.data = [];
      this.serversList.data = addServer;
    }
  }
}
