import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import * as AppActions from '../store/app.actions';

import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { ipcRenderer, IpcRenderer } from 'electron';

@Injectable({
  providedIn: 'root'
})
export class APIService {

  APIList = [];

  selectedAPIId = new Subject();

  names = new Subject();

  favHeaders = [];

  private ipc: IpcRenderer;


  constructor(public http: HttpClient, public store: Store<{appStore: any}>) {
    if ((<any>window).require) {
      try {
        this.ipc = (<any>window).require('electron').ipcRenderer;
      } catch (error) {
        throw error;
      }
    } else {
      console.warn('Could not load electron ipc')
    }
   }

  fetchServicesList(): Observable<any> {
    return this.http.get('http://localhost:4000/server/services')
      .pipe(
        map((res: any) => {
          this.ipc.on('tested', (e) => console.log(e));
          this.ipc.send('test');
          this.APIList = res;
          this.store.dispatch(new AppActions.APIList(res));
          return true;
        })
      );
  }

  fetchServersList(): Observable<any> {
    return this.http.get('http://localhost:4000/server/servers');
  }

  fetchMenuItems(): object[] {
    const items = [];
    this.APIList.slice().forEach((sys, sysIdx) => {
      items.push({
        name: sys.name,
        id: sysIdx,
        expanded: true,
        edit: false,
        services: []
      });
      sys.services.forEach((srv, srvIdx) => {
        items[sysIdx].services.push({ id: srvIdx, name: srv.name });
      });
    });
    return items;
  }

  newService() {
    this.selectedAPIId.next();
  }

  fetchById(id) {
    const systemId = id.split('_')[0];
    const serviceId = id.split('_')[1];
    return {
      name: this.APIList[systemId].name,
      service: this.APIList[systemId].services[serviceId]
    };
  }

  save(data): Observable<any> {
    console.log('got');
    console.log(data);
    return this.http.post('http://localhost:4000/server/save', data)
      .pipe(
        map((res: any) => {
          this.APIList = res;
          // this.fetchMenuItems();
          return res;
        })
      );
  }

  send(formData): Observable<any> {
    console.log(formData);
    return this.http.post('http://localhost:4000/server/send', formData);
  }

  delete(id): Observable<any> {
    return this.http.post('http://localhost:4000/server/delete', id)
      .pipe(
        map((res: any) => {
          this.APIList = res;
          this.store.dispatch(new AppActions.APIList(res));
          return true;
        })
      );
  }

  importService(services): Observable<any> {
    return this.http.post('http://localhost:4000/server/import', services)
      .pipe(
        map( (res: any) => {
          this.APIList = res;
          this.store.dispatch(new AppActions.APIList(res));
          return res;
        })
      );
  }

  exportService() {
    return this.http.get('http://localhost:4000/server/export');
  }
}
