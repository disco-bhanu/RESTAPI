import { Component, OnInit, Input, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { APIService } from '../shared/api.service';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material';

import { APIDetails } from './api-details.model';
import { map, startWith } from 'rxjs/operators';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-api-details',
  templateUrl: './api-details.component.html',
  styleUrls: ['./api-details.component.css']
})
export class ApiDetailsComponent implements OnInit {

  form: FormGroup;

  apiDetails: APIDetails;

  isSelected = false;

  newService = false;

  headermenu;

  serviceId;

  headergroup: FormGroup = new FormGroup({});

  headers = [];

  newheader = false;

  methodOptions: string[] = ['get', 'post'];

  key: HTMLInputElement;

  headerOptions: string[] = [
    'Accept', 'Accept-Charset', 'Accept-Encoding', 'Accept-Language', 'Accept-Datetime', 'Access-Control-Request-Method',
    'Access-Control-Request-Headers', 'Authorization', 'Cache-Control', 'Connection', 'Content-Length', 'Content-MD5',
    'Content-Type', 'Cookie', 'Date', 'Expect', 'Forwarded', 'From', 'Host', 'If-Match', 'If-Modified-Since',
    'If-None-Match', 'If-Range', 'If-Unmodified-Since', 'Max-Forwards', 'Origin', 'Pragma', 'Proxy-Authorization',
    'Range', 'Referer', 'TE', 'User-Agent', 'Upgrade', 'Via', 'Warning', 'Upgrade-Insecure-Requests', 'X-Requested-With',
    'DNT', 'X-Forwarded-For', 'X-Forwarded-Host', 'X-Forwarded-Proto', 'Front-End-Https', 'X-Http-Method-Override',
    'X-ATT-DeviceId', 'X-Wap-Profile', 'Proxy-Connection', 'X-UIDH', 'X-Csrf-Token', 'X-Request-ID', 'X-Correlation-ID', 'Save-Data'
  ];

  filterOptionsForMethod: Observable<string[]>;

  filterOptionsForHeaders: string[];

  @Input() set serviceContent(content) {
    if (content === undefined) {
      this.newService = true;
    } else {
      this.serviceId = content;
      this.apiDetails = this.apiService.fetchById(content);
      this.headers = Object.keys(this.apiDetails.service.headers);
    }
    this.buildForm();
    this.isSelected = true;

  }

  @Output() delete = new EventEmitter();

  constructor(private apiService: APIService, private snackbar: MatSnackBar) { }

  ngOnInit() {
    this.filterOptionsForMethod = this.form.controls['method'].valueChanges
      .pipe(
        startWith(''),
        map(value => this.filter(value))
      );
  }

  buildForm() {
    let systemName = null;
    let systemId = null;
    let serviceName = null;
    let serviceId = null;
    let description = null;
    let url = null;
    let method = null;
    let sampleRequest = null;
    let sampleResponse = null;
    let body = null;


    if (!this.newService) {
      systemName = this.apiDetails.name;
      systemId = this.apiDetails.id;
      serviceName = this.apiDetails.service.name;
      serviceId = this.apiDetails.service.id;
      description = this.apiDetails.service.description;
      url = this.apiDetails.service.url;
      method = this.apiDetails.service.method;
      body = this.apiDetails.service.body,
      Object.keys(this.headers).forEach(header => {
        this.headergroup.addControl(this.headers[header], new FormControl(this.headers[header]));
      });
      sampleRequest = this.apiDetails.service.sampleRequest || null;
      sampleResponse = this.apiDetails.service.sampleResponse || null;
    } else {
      this.newService = false;
    }

    this.form = new FormGroup({
      systemName: new FormControl(systemName),
      systemId: new FormControl(systemId),
      serviceName: new FormControl(serviceName),
      serviceId: new FormControl(serviceId),
      description: new FormControl(description),
      url: new FormControl(url),
      method: new FormControl(method),
      body: new FormControl(body),
      headers: this.headergroup,
      sampleRequest: new FormControl(sampleRequest),
      sampleResponse: new FormControl(sampleResponse)
    });

  }

  onTest() {
    this.apiService.send(this.form.value)
      .subscribe(res => {
        this.form.controls['sampleResponse'].patchValue(JSON.stringify(res, undefined, 4));
      });
  }

  onSave() {
    console.log(this.form.value);
    this.apiService.save(this.form.value)
      .subscribe(res => {
        console.log('Got the resoinse frm server');
        console.log(res);
        this.snackbar.open('Saved.', null, {
          duration: 2000,
          horizontalPosition: 'right'
        });
      });
  }

  onNewHeader() {
    this.newheader = true;
  }

  onAdd(key: HTMLInputElement, value: HTMLInputElement) {
    if (key.value !== '' && value.value !== '') {
      this.headers.push(key.value);
      this.headergroup.addControl(key.value, new FormControl(value.value));
      this.newheader = false;
    }
  }

  onHeadersKey(event) {
    this.filterOptionsForHeaders = this.headerOptions.filter(header => header.toLowerCase().includes(event.target.value));
  }

  filter(val: string): string[] {
    return this.methodOptions.filter(option => option.toLowerCase().includes(val.toLowerCase()));
  }

  onDelete() {
    this.apiService.delete(this.apiDetails.id + '_' + this.apiDetails.service.id)
      .subscribe( res => {
        this.delete.emit('');
        console.log(res);
      });
  }

}
