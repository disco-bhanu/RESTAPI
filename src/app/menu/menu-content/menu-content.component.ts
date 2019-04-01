import { Component, OnInit, Output, EventEmitter, ApplicationInitStatus } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AppActions from '../../store/app.actions';

import { APIService } from '../../shared/api.service';

@Component({
  selector: 'app-menu-content',
  templateUrl: './menu-content.component.html',
  styleUrls: ['./menu-content.component.css']
})
export class MenuContentComponent implements OnInit {
  tabs = [{id: '0_0', name: 'New'}];
  names = [];
  selectedTab = 0;
  activeTabIndex;
  servicemenu;
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
        if (selected.sysid === 0 && selected.srvid === 0) {
        } else {
          const tabId = selected.sysid + '_' + selected.srvid;
          const tabIdx = this.tabs.findIndex(tab => tab.id === tabId);
          if (tabIdx === -1) {
            console.log('not found')
            this.tabs.push({ id: tabId, name: selected.srvname });
            this.selectedTab = this.tabs.length - 1;
          } else {
            this.selectedTab = tabIdx;
          }
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
    this.tabs.push({ id: '0_0', name: 'New'});
    this.selectedTab = this.tabs.length - 1;
  }
}
