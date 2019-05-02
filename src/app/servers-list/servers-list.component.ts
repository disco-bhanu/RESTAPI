import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatDialogRef, MatChipInputEvent } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';

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

  validate = false;

  separatorKeysCodes = [ENTER, COMMA];

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

  onSet(idx) {
    this.selectedIndex = idx;
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

  onAdd(event: MatChipInputEvent): void {
    if (event.value === null || event.value.trim().length === 0) {
      this.validate = true;
    } else {
      this.validate = false;
      this.serversList.data.push({name: event.value, set: false});
      this.apiService.addServer(event.value)
        .subscribe(res => console.log(res));
    }
    if (event.input) {
      event.input.value = '';
    }
  }

  onRemove(idx) {
    // this.serversList.data.splice(idx, 1);
    this.apiService.deleteServer(idx)
      .subscribe(res => this.serversList.data = res);
  }
}
