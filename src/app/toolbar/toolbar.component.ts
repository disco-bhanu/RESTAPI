import { Component, OnInit } from '@angular/core';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ServerNamesComponent } from '../server-names/server-names.component';
import { GlobalHeadersComponent } from '../global-headers/global-headers.component';
import { EditServicesComponent } from '../edit-services/edit-services.component';
import { APIService } from '../services/api.service';

import { Store } from '@ngrx/store';
import * as AppActions from '../store/app.actions';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  bsModalRef: BsModalRef;

  constructor(private modalService: BsModalService, public apiService: APIService, public store: Store<{appStore: any}>) { }

  ngOnInit() {
  }

  onOpenServerModal() {
    this.bsModalRef = this.modalService.show(ServerNamesComponent, {class: 'modal-xl'});
  }

  onOpenGlobalHeadersModal() {
    this.bsModalRef = this.modalService.show(GlobalHeadersComponent, {class: 'modal-xl'});
  }

  onOpenEditServicesModal() {
    this.bsModalRef = this.modalService.show(EditServicesComponent, {class: 'modal-xl'});
  }

  onShown() {
    console.log('show');
  }

  onHidden() {
    console.log('hidden');
  }

  onUpload(e) {
    console.log(e.target.files[0]);
    this.apiService.importService(e.target.files[0])
      .subscribe(
        res => {
            console.log(res);
            this.store.dispatch(new AppActions.Notification({type: 'danger', message: 'Imported sucessfully.', show: true}));
        },
        (err) => {
          console.log(err);
          this.store.dispatch(new AppActions.Notification({type: 'danger', message: 'Import failed.', show: true}));
        }
      );
  }

  onExportServices() {
    this.apiService.exportService()
      .subscribe((res: any) => {
        console.log(res);
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([JSON.stringify(res, null, 2)], {type: 'application/json'}));
        a.download = 'services.json';
        // start download
        a.click();
      });
  }

}
