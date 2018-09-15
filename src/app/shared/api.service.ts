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
          'body': 'Testing',
          'headers': {
            'contentType': 'json',
            'dataType': 'json'
          },
          'sampleRequest': '',
          'sampleResponse': ''
        },
        {
          'id': 2,
          'name': 'Service 2',
          'description': 'blah blah blah',
          'url': 'google2.com',
          'method': 'post',
          'body': 'Testing',
          'headers': {
            'contentType': 'json',
            'dataType': 'json'
          },
          'sampleRequest': '',
          'sampleResponse': ''
        },
        {
          'id': 3,
          'name': 'Service 3',
          'description': 'blah blah blah',
          'url': 'google3.com',
          'method': 'post',
          'body': 'Testing',
          'headers': {
            'contentType': 'json',
            'dataType': 'json'
          },
          'sampleRequest': '',
          'sampleResponse': ''
        },
        {
          'id': 4,
          'name': 'Service 4',
          'description': 'blah blah blah',
          'url': 'google4.com',
          'method': 'post',
          'body': 'Testing',
          'headers': {
            'contentType': 'json',
            'dataType': 'json'
          },
          'sampleRequest': '',
          'sampleResponse': ''
        },
        {
          'id': 5,
          'name': 'Service 5',
          'description': 'blah blah blah',
          'method': 'post',
          'url': 'google5.com',
          'body': 'Testing',
          'headers': {
            'contentType': 'json',
            'dataType': 'json'
          },
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
          'body': 'Testing',
          'headers': {
            'contentType': 'json',
            'dataType': 'json'
          },
          'sampleRequest': '',
          'sampleResponse': ''
        },
        {
          'id': 7,
          'name': 'Service 7',
          'description': 'blah blah blah',
          'url': 'google7.com',
          'method': 'post',
          'body': 'Testing',
          'headers': {
            'contentType': 'json',
            'dataType': 'json'
          },
          'sampleRequest': '',
          'sampleResponse': ''
        },
        {
          'id': 8,
          'name': 'Service 8',
          'description': 'blah blah blah',
          'url': 'google8.com',
          'method': 'post',
          'body': 'Testing',
          'headers': {
            'contentType': 'json',
            'dataType': 'json'
          },
          'sampleRequest': '',
          'sampleResponse': ''
        },
        {
          'id': 9,
          'name': 'Service 9',
          'description': 'blah blah blah',
          'url': 'google9.com',
          'method': 'post',
          'body': 'Testing',
          'headers': {
            'contentType': 'json',
            'dataType': 'json'
          },
          'sampleRequest': 'Test1',
          'sampleResponse': 'Testt1'
        },
        {
          'id': 10,
          'name': 'Service 10',
          'description': 'blah blah blah',
          'url': 'google10.com',
          'method': 'post',
          'body': '',
          'headers': {
            'contentType': 'json',
            'dataType': 'json'
          },
          'sampleRequest': 'Test2',
          'sampleResponse': 'Testst3'
        }
      ]
    }
  ];

  selectedAPIId = new Subject();

  menuItems = new Subject();

  constructor(private http: HttpClient) { }

  fetchServicesList(): Observable<any> {
    return this.http.get('/server/services')
      .pipe(
        map( (res) => {
          // this.APIList = res;
          return this.APIList.slice();
        })
      );
  }

  fetchMenuItems() {
    const items = [];
    this.APIList.slice().forEach((ele, idx) => {
      items.push({ name: ele.name, id: ele.id, expanded: false, services: [] });
      ele.services.forEach(service => {
        items[idx].services.push({ id: service.id, name: service.name});
      });
    });
    console.log(items);
    this.menuItems.next(items);
  }

  fetchMenuItemsBySearch(serviceName) {
    const items = [];
    let serviceList = [];
    this.APIList.slice().forEach( system => {
      serviceList = [];
      system.services.forEach( service => {
        if (service.name.toUpperCase().replace(/\s/g, '').includes(serviceName.toUpperCase().replace(/\s/g, ''))) {
          serviceList.push({ id: service.id, name: service.name});
        }
      });
      if (serviceList.length > 0) {
        items.push({ name: system.name, expanded: true , id: system.id, services: serviceList});
      }
    });
    this.menuItems.next(items);
    return items;
  }

  selectAPIByID(id) {
    const systemId = id.split('_')[0];
    const serviceId = id.split('_')[1];
    console.log(systemId + ' ' + serviceId);
    // console.log(this.APIList);
    // console.log(this.APIList[systemId].services[serviceId]);
    // this.selectedAPI.next(this.APIList[systemId].services[serviceId]);
    this.selectedAPIId.next(id);
  }

  newService() {
    this.selectedAPIId.next();
  }

  fetchNamesById(id) {
    const systemId = id.split('_')[0];
    const serviceId = id.split('_')[1];
    const system: any = this.APIList.filter(sys => sys.id.toString() === systemId.toString()); // [systemId].name;
    const service: any = system[0].services.filter( srv => srv.id.toString() === serviceId.toString());
    return system[0].name + ' > ' + service[0].name;
  }

  fetchById(id) {
    const systemId = id.split('_')[0];
    const serviceId = id.split('_')[1];
    const system: any = this.APIList.filter(sys => sys.id.toString() === systemId.toString());
    console.log(system);
    const service: any = system[0].services.filter( srv => srv.id.toString() === serviceId.toString());
    console.log(service);

    // return service[0];
    return { name: system[0].name, id: system[0].id, service: service[0]};
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

    const headers = new HttpHeaders();

    Object.keys(formdata.headers).forEach( header => {
      headers.set(header, formdata.headers[header]);
    });

    if (formdata.method === 'get') {
      console.log('inside get request');
      return this.http.get(formdata.url, { headers: headers})
        .pipe(
          map( (res: Response) => {
            return res;
          }
        ) );
    } else if (formdata.method === 'post') {
      return this.http.post(formdata.url, formdata.body, { headers: headers})
      .pipe(
        map( (res: Response) => {
          return res;
        }
      ) );
    }

  }

  delete(id): Observable<any> {
    console.log('delete...............');
    console.log(id);
    return this.http.post('/server/delete', { id: id })
      .pipe(
        map( res => {
          return res;
        })
      );
  }

}
