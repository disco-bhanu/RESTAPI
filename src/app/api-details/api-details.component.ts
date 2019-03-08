import { Component, OnInit, Input, Output } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { APIService } from '../shared/api.service';
import { Observable } from 'rxjs';
import { MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { APIDetails } from './api-details.model';
import { map, startWith } from 'rxjs/operators';
import { EventEmitter } from '@angular/core';

import { HeadersFavComponent } from './headers-fav/headers-fav.component';
import { HeadersList } from './headers-fav/standard-headers';

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

  changeTabOnSend = 0;

  headermenu;

  serviceId;

  headers = [];

  newheader = false;

  methodOptions: string[] = ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'];

  key: HTMLInputElement;

  filterOptionsForMethod: Observable<string[]>;

  filterOptionsForHeaderKey: string[];

  filterOptionsForHeaderValue: string[];

  responseTime: String;

  statusCode: String;

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

  constructor(private apiService: APIService, private snackbar: MatSnackBar, public dialog: MatDialog) { }

  ngOnInit() {
    this.responseTime = '--';
    this.statusCode = '--';
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
    let response = null;
    let body = null;
    const _headers = new FormArray([]);


    if (!this.newService) {
      systemName = this.apiDetails.name;
      systemId = this.apiDetails.id;
      serviceName = this.apiDetails.service.name;
      serviceId = this.apiDetails.service.id;
      description = this.apiDetails.service.description;
      url = this.apiDetails.service.url;
      method = this.apiDetails.service.method;
      body = this.apiDetails.service.body,
      this.apiDetails.service.headers.forEach( header => {
        _headers.push( new FormGroup({
          key: new FormControl(header.key),
          value: new FormControl(header.value)
        }));
      });
      response = this.apiDetails.service.sampleResponse || null;
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
      headers: _headers,
      response: new FormControl(response)
    });

  }

  onTest() {
    this.changeTabOnSend = 1;
    this.apiService.send(this.form.value)
      .subscribe(
        res => {
          this.statusCode = res.statusCode;
          this.responseTime = res.time + 'ms';
          this.form.controls['response'].patchValue(JSON.stringify(res.body, undefined, 4));
        },
        err => this.form.controls['response'].patchValue(JSON.stringify(err, undefined, 4)));
  }

  onSave() {
    console.log(this.form.value);
    this.apiService.save(this.form.value)
      .subscribe(res => {
        this.snackbar.open('Saved.', null, {
          duration: 2000,
          horizontalPosition: 'right'
        });
      });
  }

  onNewHeader() {
    this.newheader = true;
  }

  onDeleteHeader(idx) {
    (<FormArray>this.form.get('headers')).removeAt(idx);
  }

  onAdd(key: HTMLInputElement, value: HTMLInputElement) {
    if (key.value !== '' && value.value !== '') {
      this.headers.push(key.value);
      (<FormArray>this.form.get('headers')).push(
        new FormGroup({
          key: new FormControl(key.value),
          value: new FormControl(value.value)
        })
      );
      key.value = '';
      value.value = '';
      this.newheader = false;
    }
  }

  onHeadersKey(event) {
    this.filterOptionsForHeaderKey = HeadersList.keys.filter(key => key.toLowerCase().includes(event.target.value));
  }

  onHeadersValue(event) {
    this.filterOptionsForHeaderValue = HeadersList.values.filter(val => val.toLowerCase().includes(event.target.value));
  }

  filter(val: string): string[] {
    return this.methodOptions.filter(option => option.toLowerCase().includes(val.toLowerCase()));
  }

  onDelete() {
    this.apiService.delete(this.apiDetails.id + '_' + this.apiDetails.service.id)
      .subscribe( res => {
        this.delete.emit('');
        this.snackbar.open('Deleted successfully.', null, {
          duration: 2000,
          horizontalPosition: 'right'
        });
      });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(HeadersFavComponent, {
      width: '700px',
      data: {
        sysid: this.apiDetails.id,
        srvid: this.apiDetails.service.id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed');
      console.log(result);
      result.forEach(h => {
        (<FormArray>this.form.get('headers')).push(
          new FormGroup({
            key: new FormControl(h.key),
            value: new FormControl(h.value)
          })
        );
      });
    });
  }

}
