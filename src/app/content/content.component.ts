import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { TabsetComponent } from 'ngx-bootstrap';

import { Store } from '@ngrx/store';
import * as AppActions from '../store/app.actions';

export interface Tab {
  id: string;
  title: string;
}

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {
  @ViewChild('serviceTabs') serviceTabs: TabsetComponent;
  tabs: Tab[] = [{id: null, title: 'New'}];
  selectedTab = 0;
  constructor(public store: Store<{ appStore: any }>) { }

  ngOnInit() {
    this.store.select(state => state.appStore.selectedService)
      .subscribe(selected => {
        if (selected.sysId === null && selected.srvId === null) {
        } else {
          console.log(selected);
          const tabId = selected.sysId + '_' + selected.srvId;
          const tabIdx = this.tabs.findIndex(tab => tab.id === tabId);
          if (tabIdx === -1) {
            console.log('not found');
            this.tabs.push({ id: tabId, title: selected.srvName});
            this.selectedTab = this.tabs.length - 1;
            this.onTabChange(this.selectedTab);
            // this.serviceTabs.tabs[this.selectedTab].active = true;
          } else {
            this.selectedTab = tabIdx;
            this.onTabChange(this.selectedTab);
            this.tabs[tabIdx].title = selected.srvName;
            this.serviceTabs.tabs[tabIdx].active = true;
          }
          console.log(this.serviceTabs.tabs);

        }
      });
    this.store.select(state => state.appStore.saveService)
      .subscribe(tab => {
        console.log(tab);
        console.log(this.tabs);
        if (Object.keys(tab).length > 0) {
          const temp = [...this.tabs];
          temp[tab.pos].title = tab.title;
          this.tabs = [...temp];
        }
      });
  }

  selectTab(tabId: number) {
    this.serviceTabs.tabs[tabId].active = true;
  }

  onRemove(idx) {
    this.tabs.splice(idx, 1);
    idx === 0 ? this.selectedTab = this.tabs.length - 1 : this.selectedTab = idx - 1;
    this.onTabChange(this.selectedTab);
  }

  onNewTab() {
    this.tabs.push({id: null, title: 'New'});
    this.selectedTab = this.tabs.length - 1;
    this.onTabChange(this.selectedTab);
  }

  onTabChange(tabId) {
    this.store.dispatch(new AppActions.ActiveTabIndex(tabId));
  }

}
