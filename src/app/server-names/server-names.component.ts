import { Component, OnInit } from '@angular/core';
import { APIService } from '../services/api.service';
import { Store } from '@ngrx/store';
import { BsModalRef } from 'ngx-bootstrap/modal';
import * as AppActions from '../store/app.actions';

export interface List {
  name: string;
  set: boolean;
}

@Component({
  selector: 'app-server-names',
  templateUrl: './server-names.component.html',
  styleUrls: ['./server-names.component.css']
})
export class ServerNamesComponent implements OnInit {

  serversNames: List[] = [];
  list = [];
  validate = false;
  selectedIndex: any;
  constructor(public apiService: APIService, public store: Store<{ appStore: any }>, public bsModalRef: BsModalRef) { }

  ngOnInit() {
    this.apiService.fetchServersList().subscribe(
      list => {
        this.serversNames = list.reduce( (a, c) => [...a, {name: c, set: false}], []);
      }
    );
  }

  onAdd(event: HTMLInputElement) {
    console.log(event);
    if ((event.value === null || event.value.trim().length === 0)) {
      this.validate = true;
    } else {
      this.validate = false;
      this.serversNames.push({name: event.value, set: false});
      this.apiService.addServer(event.value)
        .subscribe(res => console.log(res));
    }
  }

  onRemove(idx) {
    this.serversNames.splice(idx, 1);
    this.apiService.deleteServer(idx)
      .subscribe(res => console.log(res));
  }

  onEnter(event, input) {
    if (event.keyCode === 13) {
      this.onAdd(input);
    }
  }

  onSet(idx) {
    this.selectedIndex = idx;
    const temp = [...this.serversNames];
    this.serversNames = [];
    temp.forEach((d, i) => {
      i === idx ? temp[i].set = true : temp[i].set = false;
    });
    this.serversNames = [...temp];
  }

  toCurrentTab() {
    this.store.dispatch(
      new AppActions.OverrideHost({
        current: true,
        all: false,
        hostname: this.serversNames[this.selectedIndex].name
      })
    );
  }

  toAllTabs() {
    this.store.dispatch(
      new AppActions.OverrideHost({
        current: false,
        all: true,
        hostname: this.serversNames[this.selectedIndex].name
      })
    );
  }

}
