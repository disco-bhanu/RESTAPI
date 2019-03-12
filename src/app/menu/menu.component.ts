import { Component, ViewChild } from '@angular/core';
import { APIService } from '../shared/api.service';
import { MatDrawer } from '@angular/material';
import * as fromApp from '../store/app.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {

  items = [];

  selectedService: string;

  @ViewChild('drawer') public drawer: MatDrawer;

  constructor(private apiService: APIService, public store: Store<{appr: any}>) {
    this.apiService.menuItems.subscribe( (items: any) => this.items = items );
    this.apiService.fetchServicesList()
      .subscribe( res => {
        this.apiService.fetchMenuItems();
        this.apiService.fetchServiceNames();
        this.apiService.searchableMenuItems();
      });
    this.apiService.sideDrawer.subscribe(f => this.drawer.toggle());
    this.store.select('appr').subscribe(
      res => {
        console.log('From State');
        console.log(res);
      }
    );
  }

  onExpand(id) {
    this.items[id].expanded = !this.items[id].expanded;
  }

  onSelect(systemId, serviceId) {
    this.selectedService = systemId + '_' + serviceId;
    this.apiService.selectAPIByID(this.selectedService);
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

