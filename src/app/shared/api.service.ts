import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class APIService {

  APIList = [
    {
      'name': 'System 1',
      'id': 1,
      'services': [
        {
          'id': 1,
          'name': 'Service 1',
          'description': 'blah blah blah',
          'url': 'google1.com',
          'method': 'post',
          'headers': [
            { 'key': 'contentType', 'value': 'json'},
            { 'key': 'dataType', 'value': 'json'}
          ],
          'sampleRequest': '',
          'sampleResponse': ''
        },
        {
          'id': 2,
          'name': 'Service 2',
          'description': 'blah blah blah',
          'url': 'google2.com',
          'method': 'post',
          'headers': [
            { 'key': 'contentType', 'value': 'json'},
            { 'key': 'dataType', 'value': 'json'}
          ],
          'sampleRequest': '',
          'sampleResponse': ''
        },
        {
          'id': 3,
          'name': 'Service 3',
          'description': 'blah blah blah',
          'url': 'google3.com',
          'method': 'post',
          'headers': [
            { 'key': 'contentType', 'value': 'json'},
            { 'key': 'dataType', 'value': 'json'}
          ],
          'sampleRequest': '',
          'sampleResponse': ''
        },
        {
          'id': 4,
          'name': 'Service 4',
          'description': 'blah blah blah',
          'url': 'google4.com',
          'method': 'post',
          'headers': [
            { 'key': 'contentType', 'value': 'json'},
            { 'key': 'dataType', 'value': 'json'}
          ],
          'sampleRequest': '',
          'sampleResponse': ''
        },
        {
          'id': 5,
          'name': 'Service 5',
          'description': 'blah blah blah',
          'method': 'post',
          'url': 'google5.com',
          'headers': [
            { 'key': 'contentType', 'value': 'json'},
            { 'key': 'dataType', 'value': 'json'}
          ],
          'sampleRequest': '',
          'sampleResponse': ''
        }
      ]
    }, {
      'name': 'System 2',
      'id': 2,
      'services': [
        {
          'id': 6,
          'name': 'Service 6',
          'description': 'blah blah blah',
          'url': 'google6.com',
          'method': 'post',
          'headers': [
            { 'key': 'contentType', 'value': 'json'},
            { 'key': 'dataType', 'value': 'json'}
          ],
          'sampleRequest': '',
          'sampleResponse': ''
        },
        {
          'id': 7,
          'name': 'Service 7',
          'description': 'blah blah blah',
          'url': 'google7.com',
          'method': 'post',
          'headers': [
            { 'key': 'contentType', 'value': 'json'},
            { 'key': 'dataType', 'value': 'json'}
          ],
          'sampleRequest': '',
          'sampleResponse': ''
        },
        {
          'id': 8,
          'name': 'Service 8',
          'description': 'blah blah blah',
          'url': 'google8.com',
          'method': 'post',
          'headers': [
            { 'key': 'contentType', 'value': 'json'},
            { 'key': 'dataType', 'value': 'json'}
          ],
          'sampleRequest': '',
          'sampleResponse': ''
        },
        {
          'id': 9,
          'name': 'Service 9',
          'description': 'blah blah blah',
          'url': 'google9.com',
          'method': 'post',
          'headers': [
            { 'key': 'contentType', 'value': 'json'},
            { 'key': 'dataType', 'value': 'json'}
          ],
          'sampleRequest': 'Test1',
          'sampleResponse': 'Testt1'
        },
        {
          'id': 10,
          'name': 'Service 10',
          'description': 'blah blah blah',
          'url': 'google10.com',
          'method': 'post',
          'headers': [
            { 'key': 'contentType', 'value': 'json'},
            { 'key': 'dataType', 'value': 'json'}
          ],
          'sampleRequest': 'Test2',
          'sampleResponse': 'Testst3'
        }
      ]
    }
  ];

  selectedAPIId = new Subject();

  menuItems = new Subject();

  names = new Subject();

  constructor(private http: HttpClient) { }

  fetchServicesList(): Observable<any> {
    return this.http.get('/server/services')
      .pipe(
        map((res: any) => {
          this.APIList = res;
          return true;
        })
      );
  }

  fetchMenuItems() {
    const items = [];
    this.APIList.slice().forEach((ele, idx) => {
      items.push({ name: ele.name, id: ele.id, expanded: false, services: [] });
      ele.services.forEach(service => {
        items[idx].services.push({ id: service.id, name: service.name });
      });
    });
    console.log(items);
    this.menuItems.next(items);
  }

  fetchMenuItemsBySearch(serviceName) {
    const items = [];
    let serviceList = [];
    this.APIList.slice().forEach(system => {
      serviceList = [];
      system.services.forEach(service => {
        if (service.name.toUpperCase().replace(/\s/g, '').includes(serviceName.toUpperCase().replace(/\s/g, ''))) {
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

  save(data): Observable<any> {
    return this.http.post('/server/save', data)
      .pipe(
        map((res: any) => {
          this.APIList = res;
          this.fetchMenuItems();
          return res;
        })
      );
  }

  send(formdata): Observable<any> {
    console.log(formdata);
    const headers = new HttpHeaders();
    formdata.headers.forEach(header => {
      headers.set(header.key, header.value);
    });
    if (formdata.method === 'GET') {
      return this.http.get(formdata.url, { headers: headers })
        .pipe(
          map((res: Response) => {
            return res;
          }
          ));
    } else if (formdata.method === 'POST' || formdata.method === 'PUT') {
      return this.http.post(formdata.url, formdata.body, { headers: headers })
        .pipe(
          map((res: Response) => {
            return res;
          }
          ));
    }

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
