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
  apiList = [];
  selectedService: string;
  selectedServiceIDs: string;

  @ViewChild('drawer') public drawer: MatDrawer;

  constructor(
    private apiService: APIService,
    public store: Store<{ appStore: any }>
  ) {
    this.apiService.fetchServicesList().subscribe(res => {
      this.store.dispatch(new AppActions.APIList(res));
    });

    this.store
      .select(state => state.appStore.services)
      .subscribe(res => {
        console.log('From State');
        console.log(res);
        this.apiList = res;
        this.fetchMenuItems();
        this.apiService.fetchServiceNames();
      });
  }

  ngOnInit() {
    this.store
      .select(state => state.appStore.sideDrawer)
      .subscribe(flag => {
        this.drawer.toggle();
      });
  }

  fetchMenuItems() {
    this.items = [];
    this.apiList.slice().forEach((ele, idx) => {
      this.items.push({
        name: ele.name,
        id: ele.id,
        expanded: true,
        services: []
      });
      ele.services.forEach(service => {
        this.items[idx].services.push({ id: service.id, name: service.name });
      });
    });
    this.items = [...this.items];
  }

  onExpand(id) {
    this.items[id].expanded = !this.items[id].expanded;
  }

  onSelect(sysidx, srvidx) {
    this.selectedServiceIDs = sysidx + '_' + srvidx;
    const selectedService = {
      sysid: this.items[sysidx].id,
      srvid: this.items[sysidx].services[srvidx].id,
      srvname: this.items[sysidx].services[srvidx].name
    };
    this.store.dispatch(new AppActions.SelectedService(selectedService));
  }

  onNewService() {
    this.apiService.newService();
  }
}
