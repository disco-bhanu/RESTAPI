import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AppActions from '../store/app.actions';

import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class APIService {

  APIList = [];

  selectedAPIId = new Subject();

  menuItems = new Subject();

  searchableItems = new Subject();

  names = new Subject();

  // sideDrawer = new Subject();

  // overrideHostName = new Subject();

  favHeaders = [];

  constructor(public http: HttpClient, public store: Store<{appStore: any}>) { }

  fetchServicesList(): Observable<any> {
    return this.http.get('/server/services')
      .pipe(
        map((res: any) => {
          this.APIList = res;
          return res;
        })
      );
  }

  /* searchableMenuItems() {
    const items = [];
    this.APIList.slice().forEach((ele, idx) => {
      items.push({ id: ele.id, name: ele.name, services: [] });
      ele.services.forEach(service => {
        items[idx].services.push({ id: service.id, name: service.name, url: service.url });
      });
    });
    console.log(items);
    this.searchableItems.next(items);
  }*/

  /* fetchMenuItems() {
    const items = [];
    this.APIList.slice().forEach((ele, idx) => {
      items.push({ name: ele.name, id: ele.id, expanded: false, services: [] });
      ele.services.forEach(service => {
        items[idx].services.push({ id: service.id, name: service.name });
      });
    });
    console.log(items);
    this.menuItems.next(items);
  }*/
/*
  fetchMenuItemsBySearch(keyword) {
    const items = [];
    let serviceList = [];
    this.APIList.slice().forEach(system => {
      serviceList = [];
      system.services.forEach(service => {
        if (service.name.toUpperCase().replace(/\s/g, '').includes(keyword.toUpperCase().replace(/\s/g, '')) ||
            service.url.toUpperCase().replace(/\s/g, '').includes(keyword.toUpperCase().replace(/\s/g, ''))) {
          serviceList.push({ id: service.id, name: service.name });
        }
      });
      if (serviceList.length > 0) {
        items.push({ name: system.name, expanded: true, id: system.id, services: serviceList });
      }
    });
    this.menuItems.next(items);
    return items;
  }
*/
  selectAPIByID(id) {
    this.selectedAPIId.next(id);
  }

  newService() {
    this.selectedAPIId.next();
  }

  fetchNamesById(id) {
    const systemId = id.split('_')[0];
    const serviceId = id.split('_')[1];
    const system: any = this.APIList.filter(sys => sys.id.toString() === systemId.toString()); // [systemId].name;
    console.log(this.APIList);
    console.log('system');
    console.log(system);
    const service: any = system[0].services.filter(srv => srv.id.toString() === serviceId.toString());
    return system[0].name + ' > ' + service[0].name;
  }

  fetchServiceNames() {
    const serviceNames = [];
    this.APIList.forEach( (sys, idx) => {
      serviceNames.push({ systemName: sys.name, serviceNames: []});
      sys.services.forEach( srv => {
        serviceNames[idx].serviceNames.push(srv.name);
      });
    });
    this.names.next(serviceNames);
  }

  fetchById(id) {
    const systemId = id.split('_')[0];
    const serviceId = id.split('_')[1];
    const system: any = this.APIList.filter(sys => sys.id.toString() === systemId.toString());
    const service: any = system[0].services.filter(srv => srv.id.toString() === serviceId.toString());
    return { name: system[0].name, id: system[0].id, service: service[0] };
  }

  updateFavHeader(header: {key: string, value: string, comments: string}) {
    this.favHeaders.push(header);
  }

  /* overrideHost(check, name) {
    this.overrideHostName.next({check: check, name: name});
  } */

  /* toggleDrawer(flag) {
    this.sideDrawer.next(flag);
  }*/

  save(data): Observable<any> {
    return this.http.post('/server/save', data)
      .pipe(
        map((res: any) => {
          this.APIList = res;
          // this.fetchMenuItems();
          return res;
        })
      );
  }

  send(formdata): Observable<any> {
    console.log(formdata);
  /*  let _headers: HttpHeaders = new HttpHeaders();
    formdata.headers.forEach(header => {
      console.log(header);
      _headers = _headers.append(header.key.toString(), header.value.toString());
    });
    _headers = _headers.append('Access-Control-Allow-Origin', '*');
    console.log(_headers.get('Content-Type'));
    console.log(_headers.get('Access-Control-Allow-Origin'));
    if (formdata.method === 'GET') {
      return this.http.get(formdata.url, { headers: _headers })
        .pipe(
          map((res: Response) => {
            return res;
          }
        ));
    } else if (formdata.method === 'POST' || formdata.method === 'PUT') {
      return this.http.post(formdata.url, formdata.body, { headers: _headers })
        .pipe(
          map((res: Response) => {
            return res;
          }
        ));
    } */
    return this.http.post('/server/send', formdata)
      .pipe(
        map( (res: Response) => {
          console.log(res);
          return res;
        })
      );

  }

  delete(id): Observable<any> {
    return this.http.post('/server/delete', { id: id })
      .pipe(
        map(res => {
          return res;
        })
      );
  }

}
