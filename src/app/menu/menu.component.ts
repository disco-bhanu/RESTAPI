import { Component, ViewChild } from '@angular/core';
import { APIService } from '../shared/api.service';
import { MatDrawer } from '@angular/material';
import * as fromApp from '../store/app.reducer';
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
    this.apiService.menuItems.subscribe( (items: any) => this.items = items );
    this.apiService.fetchServicesList()
      .subscribe( res => {
        this.apiService.fetchMenuItems();
        this.apiService.fetchServiceNames();
        this.apiService.searchableMenuItems();
      });
    this.apiService.sideDrawer.subscribe(f => this.drawer.toggle());
    this.store.select(state => state.appStore.services ).subscribe(
      res => {
        console.log('From State');
        console.log(res);
        this.apiList = res;
        this.fetchMenuItems();
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
  //  this.selectedService = systemId + '_' + serviceId;
  //  this.apiService.selectAPIByID(this.selectedService);
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

  onDelete(e) {
    const systemId = e.split('_')[0];
    const serviceId = e.split('_')[1];
    const systemindex = this.items.findIndex(system => system.id.toString() === systemId.toString());
    const serviceindex = this.items[systemindex].services.findIndex(service => service.id.toString() === serviceId.toString());
    this.items[systemindex].services.splice(serviceindex, 1);
  }

}

