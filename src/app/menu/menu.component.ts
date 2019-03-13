import { Component, ViewChild } from '@angular/core';
import { APIService } from '../shared/api.service';
import { MatDrawer } from '@angular/material';
import * as AppActions from '../store/app.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {

  items = [];
  apiList = [];
  selectedService: string;

  @ViewChild('drawer') public drawer: MatDrawer;

  constructor(private apiService: APIService, public store: Store<{appStore: any}>) {
    // this.apiService.menuItems.subscribe( (items: any) => {
    //  this.items = items;
    // });
    this.apiService.fetchServicesList()
      .subscribe( res => {
        // this.apiService.fetchMenuItems();
        this.store.dispatch(new AppActions.APIList(res));
      });
    this.apiService.sideDrawer.subscribe(f => this.drawer.toggle());
    this.store.select(state => state.appStore.services ).subscribe(
      res => {
        console.log('From State');
        console.log(res);
        this.apiList = res;
        this.fetchMenuItems();
        this.apiService.fetchServiceNames();
        // this.apiService.searchableMenuItems();
      }
    );
  }

  fetchMenuItems() {
    this.apiList.slice().forEach((ele, idx) => {
      this.items.push({ name: ele.name, id: ele.id, expanded: false, services: [] });
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
  // this.selectedService = sysidx + '_' + srvidx;
  // this.apiService.selectAPIByID(this.selectedService);
  console.log('clicked');
  console.log(this.items[sysidx].services[srvidx]);
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

