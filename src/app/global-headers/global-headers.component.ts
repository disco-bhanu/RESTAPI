import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AppActions from '../store/app.actions';

import { APIService } from '../services/api.service';
import { HeadersList } from '../standard-headers/standard-headers';

@Component({
  selector: 'app-global-headers',
  templateUrl: './global-headers.component.html',
  styleUrls: ['./global-headers.component.css']
})
export class GlobalHeadersComponent implements OnInit {

  headers: any[] = [];

  keyOptions = HeadersList.keys;
  keySelected: string;
  valueOptions = HeadersList.values;
  valueSelected: string;

  constructor(public apiService: APIService, public store: Store<{ appStore: any }>) { }

  ngOnInit() {
    this.store.select(state => state.appStore.favHeaders).subscribe(
      header => {
        this.headers = [];
        header.map(h => {
          this.headers.push(h);
        });
        this.headers = [...this.headers];
      }
    );
  }

  onAdd(key, value, desc) {
    console.log(key.value);
    console.log(value.value);
    console.log(desc.value);
    this.headers.push({key: key.value, value: value.value, desc: desc.value, selected: false});
    this.store.dispatch(new AppActions.FavHeaders(this.headers));
  }

  onChange(idx) {
    const temp = [...this.headers];
    this.headers = [];
    temp[idx].selected = !temp[idx].selected;
    if (temp[idx].selected) {
      temp.forEach((h, i) => {
        if (h.key === temp[idx].key && idx !== i) {
          temp[i].selected = false;
        }
      });
    }
    this.headers = [...temp];
  }
}
