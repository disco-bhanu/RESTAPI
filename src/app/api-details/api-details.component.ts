import { Component, OnInit, Input } from '@angular/core';
import {FormGroup, FormControl, FormArray, Validators, AbstractControl} from '@angular/forms';
import { Store } from '@ngrx/store';
import * as AppActions from '../store/app.actions';
import { APIService } from '../shared/api.service';
import { Observable } from 'rxjs';
import { MatSnackBar, MatDialog } from '@angular/material';
import { APIDetails } from './api-details.model';
import { map, startWith } from 'rxjs/operators';

import { NotifierComponent } from '../notifier/notifier.component';
import { SaveServiceComponent } from '../save-service/save-service.component';
import { HeadersList } from '../shared/standard-headers';

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
  serviceId;
  headers = [];
  newHeader = false;
  methodOptions: string[] = ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'];
  key: HTMLInputElement;
  filterOptionsForMethod: Observable<string[]>;
  filterOptionsForHeaderKey: string[];
  filterOptionsForHeaderValue: string[];
  responseTime: String = '--';
  statusCode: String = '--';
  activeTabNum;
  tabPosition;

  @Input() set serviceContent(id) {
    if (id === null) {
      this.newService = true;
    } else {
      this.serviceId = id;
      this.apiDetails = this.apiService.fetchById(id);
      this.headers = Object.keys(this.apiDetails.service.headers);
    }
    this.buildForm();
    this.isSelected = true;
  }

  @Input() set position(id) {
    this.tabPosition = id;
  }

  constructor(
    private apiService: APIService,
    private snackbar: MatSnackBar,
    public dialog: MatDialog,
    public store: Store<{ appStore: any }>
  ) {}

  ngOnInit() {
    this.filterOptionsForMethod = this.form.controls['method'].valueChanges.pipe(
      startWith(''),
      map(value => this.filter(value))
    );

    this.store.select(state => state.appStore.activeTabIndex).subscribe(
      index => this.activeTabNum = index
    );

    this.store
      .select(state => state.appStore.overrideHost)
      .subscribe((overrideHost: { check: boolean; hostname: string }) => {
        if (
          (overrideHost.check && this.activeTabNum === this.tabPosition) ||
          (!overrideHost.check && overrideHost.hostname !== 'initial')
        ) {
          const uri: string = this.form.controls['url'].value;
          if (uri !== undefined && uri !== null) {
            const method: string = uri.substring(0, uri.indexOf('://'));
            const urn: string = uri.substring(uri.indexOf('://') + 3);
            const path: string = urn.substring(urn.indexOf('/') + 1);
            const newURI = method + '://' + overrideHost.hostname + '/' + path;
            this.form.controls['url'].patchValue(newURI);
          }
        }
      });

  }

  buildForm() {
    let systemName = null;
    let systemId = null;
    let serviceName = null;
    let serviceId = null;
    let description = null;
    let url = null;
    let method = 'GET';
    let response = null;
    let responseHeaders = null;
    let body = null;
    const _headers = new FormArray([]);

    if (!this.newService) {
      console.log(this.apiDetails);
      systemName = this.apiDetails.name;
      systemId = this.serviceId.split('_')[0];
      serviceName = this.apiDetails.service.name;
      serviceId = this.serviceId.split('_')[1];
      description = this.apiDetails.service.description;
      url = this.apiDetails.service.url;
      method = this.apiDetails.service.method;
      body = this.apiDetails.service.body;
      this.apiDetails.service.headers.forEach(header => {
        _headers.push(
          new FormGroup({
            key: new FormControl(header.key),
            value: new FormControl(header.value)
          })
        );
      });
      response = this.apiDetails.service.sampleResponse || null;
      responseHeaders = null;
    } else {
      this.newService = false;
    }

    _headers.push(
      new FormGroup({
        key: new FormControl(),
        value: new FormControl()
      }));

    this.form = new FormGroup({
      systemName: new FormControl(systemName),
      systemId: new FormControl(systemId),
      serviceName: new FormControl(serviceName),
      serviceId: new FormControl(serviceId),
      description: new FormControl(description),
      url: new FormControl(url, [Validators.required, Validators.pattern(/^(http|https|HTTP|HTTPS):\/\//)]),
      method: new FormControl(method, Validators.required),
      body: new FormControl(body),
      headers: _headers,
      response: new FormControl(response),
      responseHeaders: new FormControl(responseHeaders)
    });
  }

  onSend() {
    if (this.onValidate()) {
      this.changeTabOnSend = 1;
      this.apiService.send(this.form.value).subscribe(
        res => {
          this.statusCode = res.statusCode;
          this.responseTime = res.time + 'ms';
          this.form.controls['response'].patchValue(
            JSON.stringify(res.body, undefined, 4)
          );
          this.form.controls['responseHeaders'].patchValue(
            JSON.stringify(res.headers, undefined, 4)
          );
        },
        err => {
          this.form.controls['response'].patchValue(JSON.stringify(err, undefined, 4));
        }
      );
    }
  }

  onResponseTabIndexChanged(e) {
    this.changeTabOnSend = e;
  }

  onSave() {
    if (this.onValidate()) {
      this.onOpenSaveDialog();
    }
  }

  onValidate() {
    if (!this.form.get('url').valid) {
      this.snackbar.openFromComponent(NotifierComponent, {
        horizontalPosition: 'right',
        data: { message: 'URL is invalid.'}
      });
      return false;
    }
    if (!this.form.get('method').valid) {
      this.snackbar.openFromComponent(NotifierComponent, {
        horizontalPosition: 'right',
        data: { message: 'Method is invalid.'}
      });
      return false;
    }
    return true;
  }

  onDeleteHeader(idx) {
    (<FormArray>this.form.get('headers')).removeAt(idx);
  }

  onHeadersKey(event, idx) {
    if ((<FormArray>this.form.get('headers')).length - 1 === idx) {
      (<FormArray>this.form.get('headers')).push(new FormGroup({
        key: new FormControl(null),
        value: new FormControl(null)
      }));
    }
    this.filterOptionsForHeaderKey = HeadersList.keys.filter(key =>
      key.toLowerCase().includes(event.target.value)
    );
  }

  onHeadersValue(event, idx) {
    if ((<FormArray>this.form.get('headers')).length - 1 === idx) {
      (<FormArray>this.form.get('headers')).push(new FormGroup({
        key: new FormControl(null),
        value: new FormControl(null)
      }));
    }
    this.filterOptionsForHeaderValue = HeadersList.values.filter(val =>
      val.toLowerCase().includes(event.target.value)
    );
  }

  filter(val: string): string[] {
    return this.methodOptions.filter(option =>
      option.toLowerCase().includes(val.toLowerCase())
    );
  }

  onOpenSaveDialog() {
    const dialogRef = this.dialog.open(SaveServiceComponent, {
      width: '80%',
      data: this.form.value,
      position: { left: '17%' },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(data => {
      console.log(data);
      if (data !== undefined) {
        this.apiService.save(data).subscribe(res => {
          this.store.dispatch(new AppActions.APIList(res));
        });
      }
    });
  }
}
