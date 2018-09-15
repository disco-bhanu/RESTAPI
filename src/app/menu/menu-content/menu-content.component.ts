import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { APIService } from '../../shared/api.service';

@Component({
  selector: 'app-menu-content',
  templateUrl: './menu-content.component.html',
  styleUrls: ['./menu-content.component.css']
})
export class MenuContentComponent implements OnInit {

  tabs = [];

  selectedTab = 0;

  servicemenu;

  @Output() delete = new EventEmitter();

  constructor(private apiService: APIService) { }

  ngOnInit() {
    this.apiService.selectedAPIId.subscribe(
      serviceId => {
        if (serviceId === undefined) {
          this.tabs.push({ id: serviceId, name: 'New' });
          this.selectedTab = this.tabs.length;
          this.selectedTab++;
        } else {
          const tabIdx = this.tabs.findIndex(tab => tab.id === serviceId);
          if (tabIdx === -1) {
            this.tabs.push({ id: serviceId, name: this.apiService.fetchNamesById(serviceId) });
            this.selectedTab = this.tabs.length;
            this.selectedTab++;
          } else {
            this.selectedTab = tabIdx;
          }
        }
      });
  }

  onClose(idx) {
    this.delete.emit(this.tabs[idx].id);
    this.tabs.splice(idx, 1);
  }

}
