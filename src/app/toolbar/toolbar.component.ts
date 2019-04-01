import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';

import { GlobalHeadersComponent } from '../global-headers/global-headers.component';
import { ServersListComponent } from '../servers-list/servers-list.component';
import { Store } from '@ngrx/store';
import * as AppActions from '../store/app.actions';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {
  constructor(
    public dialog: MatDialog,
    public store: Store<{ appStore: any }>
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

}
