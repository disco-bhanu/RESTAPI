import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';

import { APIService } from '../shared/api.service';
import { HeadersFavComponent } from '../api-details/headers-fav/headers-fav.component';
import { APIDetails } from '../api-details/api-details.model';

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
    const dialogRef = this.dialog.open(HeadersFavComponent, {
      width: '65%',
      data: { }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed');
      console.log(result);
    });
  }

  onOpenServerDialog(): void {

  }

}
