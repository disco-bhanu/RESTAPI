<!--
<div>
  <div *ngIf="! isSelected; else showDetails">
    <h1>Select a service </h1>
  </div>
  <ng-template #showDetails>
    <div class="col-md-12">
      <mat-card class="mt-2 mb-2">
        <mat-card-header></mat-card-header>
        <mat-card-content class="mt-3">
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <h6> Basic </h6>
              <mat-form-field appearance="outline" class="col-md-12 mx-1">
                  <mat-label for="systemName"> System Name </mat-label>
                  <input matInput name="systemName" formControlName="systemName">
                </mat-form-field>
            <mat-form-field appearance="outline" class="col-md-12 mx-1">
              <mat-label for="serviceName"> Service Name </mat-label>
              <input matInput name="serviceName" formControlName="serviceName">
            </mat-form-field>
            <mat-form-field appearance="outline" class="col-md-12 mx-1">
              <mat-label for="url"> URL </mat-label>
              <input matInput name="url" formControlName="url">
            </mat-form-field>
            <mat-form-field appearance="outline" class="col-md-12 mx-1">
              <mat-label for="method"> Method </mat-label>
              <input matInput name="method" formControlName="method">
            </mat-form-field>
            <mat-form-field appearance="outline" class="col-md-12 mx-1" *ngIf="apiDetails.service.body">
              <mat-label for="body"> Body </mat-label>
              <input matInput name="body" formControlName="body">
            </mat-form-field>
            <h6> Headers </h6>
            <div formGroupName="headers">
              <mat-form-field appearance="outline" class="col-md-12 mx-1">
                <mat-label> Content Type </mat-label>
                <input matInput formControlName="contentType">
              </mat-form-field>
              <mat-form-field appearance="outline" class="col-md-12 mx-1">
                <mat-label> Data Type </mat-label>
                <input matInput placeholder="" formControlName="dataType">
              </mat-form-field>
            </div>
            <div class="row">
                <h6> Samples </h6>
                <div class="d-flex flex-row-reverse">
                    <button mat-raised-button color="primary" > Add </button>
                </div>

            </div>

            <mat-form-field appearance="outline" class="col-md-12 mx-1">
              <mat-label> Sample Request </mat-label>
              <textarea matInput placeholder="" formControlName="sampleRequest"></textarea>
            </mat-form-field>
            <mat-form-field appearance="outline" class="col-md-12 mx-1">
              <mat-label> Sample Response </mat-label>
              <textarea matInput placeholder="" formControlName="sampleResponse"></textarea>
            </mat-form-field>
            <div class="button-row d-flex flex-row-reverse">
                  <button mat-raised-button color="primary" type="button" class="mr-3"> Test </button>
                  <button mat-raised-button class="mx-4" color="warn"> Save </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
</ng-template>
</div>
-->
<form [formGroup]="form" (ngSubmit)="onSave()">
  <div class="container-flex">
    <div class="card-flex">
        <mat-card>
            <mat-card-title>
              <h6>Basic</h6>
            </mat-card-title>
            <mat-card-content>
              <mat-form-field class="col-md-12" appearance="outline">
                <mat-label for="systemName"> System Name</mat-label>
                <input matInput type="text" name="systemName" formControlName="systemName">
              </mat-form-field>
              <mat-form-field class="col-md-12" appearance="outline">
                <mat-label for="serviceName"> Service Name</mat-label>
                <input matInput type="text" name="serviceName" formControlName="serviceName">
              </mat-form-field>
              <mat-form-field class="col-md-12" appearance="outline">
                <mat-label for="description"> Description</mat-label>
                <textarea matInput type="text" name="description" formControlName="description"></textarea>
              </mat-form-field>
            </mat-card-content>
          </mat-card>
    </div>
    <div class="card-flex">
        <mat-card>
            <mat-card-title>
              <h6>Endpoint</h6>
            </mat-card-title>
            <mat-card-content>
              <mat-form-field class="col-md-12" appearance="outline">
                <mat-label for="method"> Method</mat-label>
                <input matInput type="text" name="method" formControlName="method" [matAutocomplete]="auto">
                <mat-autocomplete #auto="matAutocomplete">
                  <mat-option *ngFor="let option of filterOptionsForMethod | async" [value]="option">
                    {{option}}
                  </mat-option>
                </mat-autocomplete>
              </mat-form-field>
              <mat-form-field class="col-md-12" appearance="outline">
                <mat-label for="url"> URL</mat-label>
                <input matInput type="text" name="url" formControlName="url">
              </mat-form-field>
              <mat-form-field class="col-md-12" appearance="outline" *ngIf="form.get('method').value === 'post'">
                <mat-label for="body"> Body</mat-label>
                <textarea matInput type="text" name="url" formControlName="body"></textarea>
              </mat-form-field>
            </mat-card-content>
          </mat-card>
    </div>
    <div class="card-flex">
    <mat-card>
        <mat-card-title>
          <h6>Headers</h6>
          <button class="d-flex" mat-icon-button [matMenuTriggerFor]="headermenu" type="button" style="position: absolute; outline: 0; top: 10px; right: 15px">
            <mat-icon>more_vert</mat-icon>
          </button>
          <mat-menu #headermenu="matMenu" xPosition='before' yPosition='above' hasBackdrop="true">
            <button mat-menu-item style="outline: 0" type="button" (click)="onNewHeader()">New Header</button>
          </mat-menu>
        </mat-card-title>
        <mat-card-content>
          <div formGroupName="headers">
            <div *ngFor="let header of headers; let i = index">
              <mat-form-field class="col-md-12" appearance="outline">
                <mat-label for="header"> {{header}}</mat-label>
                <input matInput type="text" name="header" [formControlName]="header">
              </mat-form-field>
            </div>
          </div>
          <div *ngIf="newheader">
            <div class="row ml-1">
              <mat-form-field class="col-md-4 pr-1" appearance="outline">
                <mat-label for="key"> Key </mat-label>
                <input matInput name="key" #key (keyup)="onHeadersKey($event)" [matAutocomplete]="headersauto">
                <mat-autocomplete #headersauto="matAutocomplete">
                  <mat-option *ngFor="let option of filterOptionsForHeaders" [value]="option">
                    {{option}}
                  </mat-option>
                </mat-autocomplete>
              </mat-form-field>
              <mat-form-field class="col-md-7 px-1" appearance="outline">
                <mat-label for="value"> Value </mat-label>
                <input matInput name="value" #value>
              </mat-form-field>
              <button mat-icon-button type="button" (click)="onAdd(key, value)">
                <mat-icon>add_circle</mat-icon>
              </button>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
  </div>
  <div class="card-flex">
      <mat-card>
          <mat-card-title>
            <h6>Samples</h6>
          </mat-card-title>
          <mat-card-content>
            <mat-form-field class="col-md-12" appearance="outline">
              <mat-label for="request"> Request</mat-label>
              <textarea matInput name="request" formControlName="sampleRequest"></textarea>
            </mat-form-field>
            <mat-form-field class="col-md-12" appearance="outline">
              <mat-label for="response"> Response</mat-label>
              <textarea matInput name="response" formControlName="sampleResponse"></textarea>
            </mat-form-field>
          </mat-card-content>
        </mat-card>
  </div>
    </div>
<!--  <div class="col-md-12">
    <div class="row">
      <div class="col-md-6 px-2 pt-4">
        <mat-card>
          <mat-card-title>
            <h6>Basic</h6>
          </mat-card-title>
          <mat-card-content>
            <mat-form-field class="col-md-12" appearance="outline">
              <mat-label for="systemName"> System Name</mat-label>
              <input matInput type="text" name="systemName" formControlName="systemName">
            </mat-form-field>
            <mat-form-field class="col-md-12" appearance="outline">
              <mat-label for="serviceName"> Service Name</mat-label>
              <input matInput type="text" name="serviceName" formControlName="serviceName">
            </mat-form-field>
            <mat-form-field class="col-md-12" appearance="outline">
              <mat-label for="description"> Description</mat-label>
              <textarea matInput type="text" name="description" formControlName="description"></textarea>
            </mat-form-field>
          </mat-card-content>
        </mat-card>
      </div>
      <div class="col-md-6 px-2 pt-4">
        <mat-card>
          <mat-card-title>
            <h6>Endpoint</h6>
          </mat-card-title>
          <mat-card-content>
            <mat-form-field class="col-md-12" appearance="outline">
              <mat-label for="method"> Method</mat-label>
              <input matInput type="text" name="method" formControlName="method" [matAutocomplete]="auto">
              <mat-autocomplete #auto="matAutocomplete">
                <mat-option *ngFor="let option of filterOptionsForMethod | async" [value]="option">
                  {{option}}
                </mat-option>
              </mat-autocomplete>
            </mat-form-field>
            <mat-form-field class="col-md-12" appearance="outline">
              <mat-label for="url"> URL</mat-label>
              <input matInput type="text" name="url" formControlName="url">
            </mat-form-field>
            <mat-form-field class="col-md-12" appearance="outline" *ngIf="form.get('method').value === 'post'">
              <mat-label for="body"> Body</mat-label>
              <textarea matInput type="text" name="url" formControlName="body"></textarea>
            </mat-form-field>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  </div>

  <div class="col-md-12">
    <div class="row">
      <div class="col-md-6 px-2 pt-4">
        <mat-card>
          <mat-card-title>
            <h6>Headers</h6>
            <button class="d-flex" mat-icon-button [matMenuTriggerFor]="headermenu" type="button" style="position: absolute; outline: 0; top: 10px; right: 15px">
              <mat-icon>more_vert</mat-icon>
            </button>
            <mat-menu #headermenu="matMenu" xPosition='before' yPosition='above' hasBackdrop="true">
              <button mat-menu-item style="outline: 0" type="button" (click)="onNewHeader()">New Header</button>
            </mat-menu>
          </mat-card-title>
          <mat-card-content>
            <div formGroupName="headers">
              <div *ngFor="let header of headers; let i = index">
                <mat-form-field class="col-md-12" appearance="outline">
                  <mat-label for="header"> {{header}}</mat-label>
                  <input matInput type="text" name="header" [formControlName]="header">
                </mat-form-field>
              </div>
            </div>
            <div *ngIf="newheader">
              <div class="row ml-1">
                <mat-form-field class="col-md-4 pr-1" appearance="outline">
                  <mat-label for="key"> Key </mat-label>
                  <input matInput name="key" #key (keyup)="onHeadersKey($event)" [matAutocomplete]="headersauto">
                  <mat-autocomplete #headersauto="matAutocomplete">
                    <mat-option *ngFor="let option of filterOptionsForHeaders" [value]="option">
                      {{option}}
                    </mat-option>
                  </mat-autocomplete>
                </mat-form-field>
                <mat-form-field class="col-md-7 px-1" appearance="outline">
                  <mat-label for="value"> Value </mat-label>
                  <input matInput name="value" #value>
                </mat-form-field>
                <button mat-icon-button type="button" (click)="onAdd(key, value)">
                  <mat-icon>add_circle</mat-icon>
                </button>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
      <div class="col-md-6 px-2 pt-4 pb-2">
        <mat-card>
          <mat-card-title>
            <h6>Samples</h6>
          </mat-card-title>
          <mat-card-content>
            <mat-form-field class="col-md-12" appearance="outline">
              <mat-label for="request"> Request</mat-label>
              <textarea matInput name="request" formControlName="sampleRequest"></textarea>
            </mat-form-field>
            <mat-form-field class="col-md-12" appearance="outline">
              <mat-label for="response"> Response</mat-label>
              <textarea matInput name="response" formControlName="sampleResponse"></textarea>
            </mat-form-field>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  </div> -->

  <div class="button-flex">
    <button mat-raised-button color="accent" type="button" class="mx-2" (click)="onTest()"> Test </button>
    <button mat-raised-button color="primary"> Save </button>
    <button mat-raised-button color="warn" type="button" (click)="onDelete()" class="mx-2"> Delete </button>
  </div>

</form>
