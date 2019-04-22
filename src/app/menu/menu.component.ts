import { Component, ViewChild, OnInit } from '@angular/core';
import { APIService } from '../shared/api.service';
import { MatDrawer } from '@angular/material';
import * as AppActions from '../store/app.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  items = [];
  selectedService: string;
  selectedServiceIDs: string;

  @ViewChild('drawer') public drawer: MatDrawer;

  constructor(
    private apiService: APIService,
    public store: Store<{ appStore: any }>
  ) {
    this.apiService.fetchServicesList().subscribe(() => {
      this.items = this.apiService.fetchMenuItems();
    });

    this.store
      .select(state => state.appStore.services)
      .subscribe(res => {
        this.items = this.apiService.fetchMenuItems();
      });
  }

  ngOnInit() {
    this.store
      .select(state => state.appStore.sideDrawer)
      .subscribe(() => {
        this.drawer.toggle().then();
      });
  }

  onExpand(id) {
    this.items[id].expanded = !this.items[id].expanded;
  }

  onSelect(sysIdx, srvIdx) {
    this.selectedServiceIDs = sysIdx + '_' + srvIdx;
    const selectedService = {
      sysId: sysIdx,
      srvId: srvIdx,
      srvName: this.items[sysIdx].services[srvIdx].name
    };
    this.store.dispatch(new AppActions.SelectedService(selectedService));
  }
}
