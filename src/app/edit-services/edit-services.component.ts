import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { APIService } from '../services/api.service';

@Component({
  selector: 'app-edit-services',
  templateUrl: './edit-services.component.html',
  styleUrls: ['./edit-services.component.css']
})
export class EditServicesComponent implements OnInit {

  items: {sysName: string, services: {name: string, marked: boolean}[]}[] = [];

  constructor(public bsModalRef: BsModalRef, public apiService: APIService) { }

  ngOnInit() {
    this.fetchItems();
  }

  fetchItems() {
    this.items = [];
    this.apiService.fetchMenuItems().forEach((item: any) => {
      const list = { sysName: item.name, services: [] };
      item.services.forEach((srv: any) => {
        list.services.push({name: srv, marked: false});
      });
      this.items.push(list);
    });
  }

  onDelete(i, j) {
    this.items[i].services[j].marked = !this.items[i].services[j].marked;
  }

  onSave() {
    const  markedIndex = [];
    this.items.forEach((item, sysIdx) => {
      item.services.forEach((srv, srvIdx) => {
        if (srv.marked) {
          markedIndex.push(sysIdx + '_' + srvIdx);
        }
      });
    });
    console.log(markedIndex);
    this.apiService.delete(markedIndex)
      .subscribe(
        () => {
          this.fetchItems();
        },
        (err) => {

        }
      );
  }

}
