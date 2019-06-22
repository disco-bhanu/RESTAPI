import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { APIService } from '../services/api.service';
import { Store } from '@ngrx/store';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-save-service',
  templateUrl: './save-service.component.html',
  styleUrls: ['./save-service.component.css']
})
export class SaveServiceComponent implements OnInit {

  systemName: string;
  serviceName: string;
  description: string;

  form = new FormGroup({
    systemName: new FormControl('', Validators.required),
    serviceName: new FormControl('', Validators.required),
    description: new FormControl('')
  });
  menuItems: any[];
  systemOptions;

  @Output() return = new EventEmitter();
  constructor(public apiService: APIService, public store: Store<{ appStore: any }>, public bsModalRef: BsModalRef) { }

  ngOnInit() {
    this.menuItems = [...this.apiService.fetchMenuItems()];
    this.systemOptions = this.menuItems.map((s: any) => s.name);
    this.systemOptions = this.systemOptions.filter((item, pos) => {
      return this.systemOptions.indexOf(item) === pos;
    });
    console.log(this.systemOptions);
    console.log(this.systemName);
    console.log(this.serviceName);
    console.log(this.description);
    this.form.controls['systemName'].patchValue(this.systemName);
    this.form.controls['serviceName'].patchValue(this.serviceName);
    this.form.controls['description'].patchValue(this.description);
  }

  onSave() {
    this.return.emit(this.form.value);
    this.bsModalRef.hide();
  }

}
