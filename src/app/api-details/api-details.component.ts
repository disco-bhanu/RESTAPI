import { Component, OnInit, Input, Output } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { Store } from '@ngrx/store';
import { APIService } from '../shared/api.service';
import { Observable } from 'rxjs';
import { MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { APIDetails } from './api-details.model';
import { map, startWith } from 'rxjs/operators';

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

  responseTime: String = '--';

  statusCode: String = '--';

  activeTabNum;

  tabPosition;

  @Input() set serviceContent(content) {
    if (content === undefined || content === '0_0') {
      this.newService = true;
    } else {
      console.log(content);
      this.serviceId = content;
      this.apiDetails = this.apiService.fetchById(content);
      this.headers = Object.keys(this.apiDetails.service.headers);
    }
    this.buildForm();
    this.isSelected = true;
  }

  @Input() set tabnum(id) {
    this.activeTabNum = id;
  }

  @Input() set position(id) {
    this.tabPosition = id;
  }


  constructor(private apiService: APIService,
    private snackbar: MatSnackBar,
    public dialog: MatDialog,
    public store: Store<{appStore: any}>) { }

  ngOnInit() {
    this.filterOptionsForMethod = this.form.controls['method'].valueChanges
      .pipe(
        startWith(''),
        map(value => this.filter(value))
      );
    /* this.apiService.overrideHostName.subscribe((d: {check: boolean, name: string}) => {
      if ((d.check && this.activeTabNum === this.tabPosition) || (!d.check && name !== null) || this.activeTabNum === undefined) {
        const uri: string = this.form.controls['url'].value;
        const method: string = uri.substring(0, uri.indexOf('://'));
        const urn: string = uri.substring(uri.indexOf('://') + 3);
        // const port: number = parseInt(urn.substr(urn.indexOf(':') + 1, 4), 10);
        const path: string = urn.substring(urn.indexOf('/') + 1);
        const newURI = method + '://' + d.name + '/' + path;
        this.form.controls['url'].patchValue(newURI);
      }
    }); */
    this.store.select(state => state.appStore.overrideHost).subscribe(
      (overrideHost: {check: boolean, hostname: string}) => {
        if ((overrideHost.check && this.activeTabNum === this.tabPosition) ||
            (!overrideHost.check && overrideHost.hostname !== 'initial')) {
          const uri: string = this.form.controls['url'].value;
          const method: string = uri.substring(0, uri.indexOf('://'));
          const urn: string = uri.substring(uri.indexOf('://') + 3);
          const path: string = urn.substring(urn.indexOf('/') + 1);
          const newURI = method + '://' + overrideHost.hostname + '/' + path;
          this.form.controls['url'].patchValue(newURI);
        }
      }
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
    let responseHeaders = null;
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
      responseHeaders = null;
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
      response: new FormControl(response),
      responseHeaders: new FormControl(responseHeaders)
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
          this.form.controls['responseHeaders'].patchValue(JSON.stringify(res.headers, undefined, 4));
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

  openDialog(): void {
    const dialogRef = this.dialog.open(HeadersFavComponent, {
      width: '700px'
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
