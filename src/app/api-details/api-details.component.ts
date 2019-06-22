import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as AppActions from '../store/app.actions';
import { TabsetComponent } from 'ngx-bootstrap';
import { APIDetails } from './api-details.model';
import { APIService } from '../services/api.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { HeadersList } from '../standard-headers/standard-headers';
import { SaveServiceComponent } from '../save-service/save-service.component';

@Component({
  selector: 'app-api-details',
  templateUrl: './api-details.component.html',
  styleUrls: ['./api-details.component.css']
})
export class ApiDetailsComponent implements OnInit {
  faSave = faSave;

  form: FormGroup;
  apiDetails: APIDetails;
  isSelected = false;
  newService = false;
  changeTabOnSend = 0;
  serviceId;
  headers = [];
  newHeader = false;
  methodOptions: string[] = ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'];
  methodSelected = 'GET';
  keyOptions: string[] = HeadersList.keys;
  keySelected: string;
  valueOptions: string[] = HeadersList.values;
  valueSelected: string;
  key: HTMLInputElement;
  filterOptionsForMethod: Observable<string[]>;
  filterOptionsForHeaderKey: string[];
  filterOptionsForHeaderValue: string[];
  responseTime: String = '--';
  statusCode: String = '--';
  activeTabNum = null;
  tabPosition = null;
  initiated = true;
  bsModalRef: BsModalRef;
  @Input() set position(tabPosition) {
    this.tabPosition = tabPosition;
  }

  @Input() set serviceContent(id: string) {
    console.log(id);
    if (id === null) {
      this.newService = true;
    } else {
      this.serviceId = id;
      this.apiDetails = this.apiService.fetchById(id);
      this.headers = Object.keys(this.apiDetails.service.headers);
      this.initiated = true;
    }
    this.buildForm();
    this.isSelected = true;
  }

  @ViewChild('responseTabs') responseTabs: TabsetComponent;

  constructor(
    public store: Store<{appStore: any}>,
    public apiService: APIService,
    public modalService: BsModalService) {
    this.activeTabNum = null;
    this.tabPosition = null;
   }

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
      .subscribe((overrideHost: { current: boolean; all: boolean; hostname: string }) => {
        if (
          (overrideHost.current && this.activeTabNum === this.tabPosition &&
            this.activeTabNum !== null && this.tabPosition !== null && !this.initiated) ||
          (overrideHost.all && this.activeTabNum !== null && this.tabPosition !== null && !this.initiated)
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
    this.initiated = false;
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
            enable: new FormControl(true),
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
        enable: new FormControl(true),
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

  filter(val: string): string[] {
    return this.methodOptions.filter(option =>
      option.toLowerCase().includes(val.toLowerCase())
    );
  }

  onHeadersKeyPress(event, idx) {
    if ((<FormArray>this.form.get('headers')).length - 1 === idx) {
      (<FormArray>this.form.get('headers')).push(new FormGroup({
        enable: new FormControl(true),
        key: new FormControl(null),
        value: new FormControl(null)
      }));
    }
  }

  onRemoveHeader(idx) {
    (<FormArray>this.form.get('headers')).removeAt(idx);
  }

  onSend() {
    if (this.onValidate()) {
      this.form.controls['response'].patchValue('');
      this.form.controls['responseHeaders'].patchValue('');
      this.responseTabs.tabs[1].active = true;
      this.changeTabOnSend = 1;
      this.apiService.send(this.form.value).subscribe(
        res => {
          console.log(res);
          if (res.hasOwnProperty('error')) {
            this.form.controls['response'].patchValue(JSON.stringify(res, undefined, 4));
          } else {
            this.statusCode = res.statusCode;
            this.responseTime = res.time + 'ms';
            this.form.controls['response'].patchValue(JSON.stringify(res.body, undefined, 4));
            this.form.controls['responseHeaders'].patchValue(JSON.stringify(res.headers, undefined, 4));
          }
        },
        err => {
          this.form.controls['response'].patchValue(JSON.stringify(err, undefined, 4));
        }
      );
    }
  }

  onSave() {
    if (this.onValidate()) {
      const data = {
        systemName: this.form.controls['systemName'].value,
        serviceName: this.form.controls['serviceName'].value,
        description: this.form.controls['description'].value
      };
      this.bsModalRef = this.modalService.show(SaveServiceComponent, {class: 'modal-xl', initialState: data});
      this.bsModalRef.content.return
        .subscribe( d => {
          this.form.controls['systemName'].patchValue(d.systemName);
          this.form.controls['serviceName'].patchValue(d.serviceName);
          this.form.controls['description'].patchValue(d.description);
          if (this.form.controls['systemName'].value.trim() !== '' && this.form.controls['serviceName'].value.trim() !== '') {
            this.apiService.save(this.form.value).subscribe( r => {
              this.store.dispatch(new AppActions.APIList(r));
              this.store.dispatch(new AppActions.SaveService({title: this.form.controls['serviceName'].value, pos: this.tabPosition}));
            });
          }
         });
    }
  }

  onValidate() {
    console.log('validate');
    if (!this.form.get('url').valid) {
      console.log('error urk');
      this.store.dispatch(new AppActions.Notification({type: 'danger', message: 'Invalid URL.', show: true}));
      return false;
    }
    if (!this.form.get('method').valid) {
      console.log('error method');
      this.store.dispatch(new AppActions.Notification({type: 'danger', message: 'Invalid Method.', show: true}));
      return false;
    }
    return true;
  }

}
