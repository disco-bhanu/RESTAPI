import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(private http: HttpClient) { }

  public send(formdata): Observable<any> {

/*    const headers = new HttpHeaders();

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
*/
    return this.http.post('/server/send', formdata)
      .pipe(
        map( (res: Response) => {
          console.log(res);
          return res;
        }
      ));
  }

}
