import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiListService {

  APIList;

  selectedAPI = new Subject<any>();

  newService = new EventEmitter();

  constructor(private http: HttpClient) { }

  fetchServicesList(): Observable<any> {
    return this.http.get('/server/services')
      .pipe(
        map( (res: Response) => {
          this.APIList = res;
          return this.APIList.slice();
        })
      );
  }

  getAPIByID(id) {
    this.selectedAPI.next(this.APIList[id]);
  }

  createNewService() {
    this.newService.emit();
  }

}
