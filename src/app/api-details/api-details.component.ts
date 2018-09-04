import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiListService } from '../api-list/api-list.service';

import { APIDetails } from './api-details.model';

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

  constructor(private apiListService: ApiListService) { }

  ngOnInit() {
    this.apiListService.selectedAPI.subscribe(
      (selectedAPI) => {
        this.apiDetails = selectedAPI;
        this.isSelected = true;
        this.newService = false;
        console.log(this.apiDetails);
        this.buildForm();
      }
    );

    this.apiListService.newService.subscribe(
      () => {
        this.isSelected = true;
        this.newService = true;
        this.buildForm();
      }
    );
  }

  buildForm() {
    let name = null;
    let url = null;
    let method = null;
    let contentType = null;
    let dataType = null;
    let sampleRequest = null;
    let sampleResponse = null;

    if (!this.newService) {
      name = this.apiDetails.name;
      url = this.apiDetails.url;
      method = this.apiDetails.method;
      contentType = this.apiDetails.headers.contentType;
      dataType = this.apiDetails.headers.dataType;
      sampleRequest = this.apiDetails.sampleRequest;
      sampleResponse = this.apiDetails.sampleResponse;
    }

    this.form = new FormGroup({
      name: new FormControl(name),
      url: new FormControl(url),
      method: new FormControl(method),
      headers: new FormGroup({
        contentType: new FormControl(contentType),
        dataType: new FormControl(dataType),
      }),
      sampleRequest: new FormControl(sampleRequest),
      sampleResponse: new FormControl(sampleResponse)
    });
  }

  onSubmit() {
    console.log('Form submitted');
  }

}
