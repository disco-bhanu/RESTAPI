import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';

import { APIService } from '../shared/api.service';
import { HeadersFavComponent } from '../api-details/headers-fav/headers-fav.component';
import { APIDetails } from '../api-details/api-details.model';
import { ServersListComponent } from '../servers-list/servers-list.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  drawerToggleFlag = true;

  constructor(public APIservice: APIService, public dialog: MatDialog) { }

  ngOnInit() {
    this.APIservice.toggleDrawer(this.drawerToggleFlag);
  }

  drawerToggle(): void {
    this.drawerToggleFlag = !this.drawerToggleFlag;
    this.APIservice.toggleDrawer(this.drawerToggleFlag);
  }

  onOpenGlobalHeaderDialog(): void {
    const headersFavDialogRef = this.dialog.open(HeadersFavComponent, {
      width: '80%',
      data: { },
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
      data: { },
      position: { left: '17%' }
    });

    serversListDialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed');
      console.log(result);
    });
  }

}
