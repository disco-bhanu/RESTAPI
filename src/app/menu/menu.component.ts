import { Component, OnInit } from '@angular/core';

import { faDesktop, faChevronUp, faChevronDown, faNetworkWired } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import * as AppActions from '../store/app.actions';
import { APIService } from '../services/api.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  faDesktop = faDesktop;
  faChevronUp = faChevronUp;
  faNetworkWired = faNetworkWired;
  faChevronDown = faChevronDown;

  items = [];

  constructor(public store: Store<{ appStore: any }>, public apiService: APIService) {
    this.apiService.fetchServicesList().subscribe(() => {
      this.items = this.apiService.fetchMenuItems();
      console.log(this.items);
    });

    this.store
    .select(state => state.appStore.services)
    .subscribe(res => {
      this.items = this.apiService.fetchMenuItems();
    });
  }

  ngOnInit() {  }

  onExpand(idx) {
    this.items[idx].expanded = !this.items[idx].expanded;
  }

  onSelect(sysIdx, srvIdx) {
    console.log(sysIdx, srvIdx);
    this.store.dispatch(new AppActions.SelectedService({
      sysId: sysIdx,
      srvId: srvIdx,
      srvName: this.items[sysIdx].services[srvIdx]
    }));
  }

}
