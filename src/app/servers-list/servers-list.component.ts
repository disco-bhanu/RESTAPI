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

  serversList: List[] = [];

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
        this.serversList = list.reduce( (a, c) => [...a, {name: c, set: false}], []);
      }
    );
  }

  onSet(idx) {
    this.selectedIndex = idx;
    const temp = [...this.serversList];
    this.serversList = [];
    temp.forEach((d, i) => {
      i === idx ? temp[i].set = true : temp[i].set = false;
    });
    this.serversList = [...temp];
  }

  toCurrentTab() {
    this.store.dispatch(
      new AppActions.OverrideHost({
        check: true,
        hostname: this.serversList[this.selectedIndex].name
      })
    );
    this.serverListDialogRef.close();
  }

  toAllTabs() {
    this.store.dispatch(
      new AppActions.OverrideHost({
        check: false,
        hostname: this.serversList[this.selectedIndex].name
      })
    );
    this.serverListDialogRef.close();
  }

  onAdd(event: MatChipInputEvent): void {
    // remove focus from selected chip
    event.input.focus({ preventScroll: false});

    if (event.value === null || event.value.trim().length === 0) {
      this.validate = true;
    } else {
      this.validate = false;
      this.serversList.push({name: event.value, set: false});
      this.apiService.addServer(event.value)
        .subscribe(res => console.log(res));
    }

    // empty the input text
    if (event.input) {
      event.input.value = '';
    }
  }

  onRemove(idx) {
    this.serversList.splice(idx, 1);
    this.apiService.deleteServer(idx)
      .subscribe(res => console.log(res));
  }
}
