import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AppActions from '../../store/app.actions';

import { APIService } from '../../shared/api.service';

@Component({
  selector: 'app-menu-content',
  templateUrl: './menu-content.component.html',
  styleUrls: ['./menu-content.component.css']
})
export class MenuContentComponent implements OnInit {
  tabs = [{id: null, name: 'New'}];
  names = [];
  selectedTab = 0;
  activeTabIndex;
  position;

  constructor(
    public apiService: APIService,
    public store: Store<{ appStore: any }>
  ) {}

  ngOnInit() {
    this.apiService.names.subscribe((res: any) => (this.names = res));
    this.store
      .select(state => state.appStore.selectedService)
      .subscribe(selected => {
        console.log(selected);
        // Initial state
        if (selected.sysId === null && selected.srvId === null) {
        } else {
          const tabId = selected.sysId + '_' + selected.srvId;
          const tabIdx = this.tabs.findIndex(tab => tab.id === tabId);
          if (tabIdx === -1) {
            console.log('not found');
            this.tabs.push({ id: tabId, name: selected.srvName });
            this.selectedTab = this.tabs.length - 1;
          } else {
            this.selectedTab = tabIdx;
            this.tabs[tabIdx].name = selected.srvName;
          }
        }
      });
    this.store.select(state => state.appStore.saveService)
      .subscribe( savedService => {
        if (savedService.sysId !== undefined && savedService.srvId !== undefined) {
          this.tabs[this.selectedTab].name = savedService.srvName;
          this.tabs[this.selectedTab].id = savedService.sysId + '_' + savedService.srvId;
        }
      });
  }

  onTabIndexChanged(e) {
    this.store.dispatch(new AppActions.ActiveTabIndex(e));
  }

  onClose(idx) {
    this.tabs.splice(idx, 1);
  }

  onNewRequest() {
    console.log('add');
    this.tabs.push({ id: null, name: 'New'});
    this.selectedTab = this.tabs.length - 1;
  }
}
