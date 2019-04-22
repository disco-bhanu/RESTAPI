import { Component } from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';

import { GlobalHeadersComponent } from '../global-headers/global-headers.component';
import { ServersListComponent } from '../servers-list/servers-list.component';
import { Store } from '@ngrx/store';
import * as AppActions from '../store/app.actions';
import { APIService } from '../shared/api.service';
import { EditServicesComponent } from '../edit-services/edit-services.component';
import {NotifierComponent} from '../notifier/notifier.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {
  constructor(
    public dialog: MatDialog,
    public store: Store<{ appStore: any }>,
    public apiService: APIService,
    public snackBar: MatSnackBar
  ) {}

  drawerToggle(): void {
    this.store.dispatch(new AppActions.SideDrawer());
  }

  onOpenGlobalHeaderDialog(): void {
    const headersFavDialogRef = this.dialog.open(GlobalHeadersComponent, {
      width: '80%',
      data: {},
      position: { left: '17%' }
    });

    headersFavDialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed');
      console.log(result);
    });
  }

  onOpenServerDialog(): void {
    const serversListDialogRef = this.dialog.open(ServersListComponent, {
      width: '80%',
      data: {},
      position: { left: '17%' }
    });

    serversListDialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed');
      console.log(result);
    });
  }

  onExportServices() {
    this.apiService.exportService()
      .subscribe((res: any) => {
        console.log(res);
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob(res, {type: 'application/text'}));
        a.download = 'services.json';
        // start download
        a.click();
      });
  }

  onUpload(e) {
    console.log(e.target.files[0]);
    this.apiService.importService(e.target.files[0])
      .subscribe(
        res => {
            console.log(res);
            this.snackBar.openFromComponent(NotifierComponent, {
              horizontalPosition: 'right',
              data: { message: 'Imported Successfully.'}
            });
        },
        (err) => {
          console.log(err);
          this.snackBar.openFromComponent(NotifierComponent, {
            horizontalPosition: 'right',
            data: { message: 'Failed to import.'}
          });
        }
      );
  }

  onEditServices() {
    const editServicesDialogRef = this.dialog.open(EditServicesComponent, {
      width: '80%',
      data: {},
      position: { left: '17%' }
    });

    editServicesDialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed');
      console.log(result);
    });
  }
}
