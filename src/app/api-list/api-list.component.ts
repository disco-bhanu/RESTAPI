import { Component, OnInit } from '@angular/core';

import { ApiListService } from './api-list.service';

@Component({
  selector: 'app-api-list',
  templateUrl: './api-list.component.html',
  styleUrls: ['./api-list.component.css']
})
export class ApiListComponent implements OnInit {

  apiList = [];

  constructor(private apiListService: ApiListService) { }

  ngOnInit() {
    this.apiListService.fetchServicesList()
      .subscribe(res => {
        res.map( api => this.apiList.push(api.name));
      });
  }

  onSelect(id) {
    console.log(id);
    this.apiListService.getAPIByID(id);
  }

  onNewService() {
    this.apiListService.createNewService();
  }

}
