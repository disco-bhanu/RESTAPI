import { Component, OnInit } from '@angular/core';
import { APIService } from '../shared/api.service';
import {MatDialogRef, MatSnackBar} from '@angular/material';
import {NotifierComponent} from '../notifier/notifier.component';

@Component({
  selector: 'app-edit-services',
  templateUrl: './edit-services.component.html',
  styleUrls: ['./edit-services.component.css']
})
export class EditServicesComponent implements OnInit {

  items: {sysName: string, services: {name: string, marked: boolean}[]}[] = [];

  constructor(
    private apiService: APIService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<EditServicesComponent>
  ) { }

  ngOnInit() {
    this.apiService.fetchMenuItems().forEach((item: any) => {
      const list = { sysName: item.name, services: [] };
      item.services.forEach((srv: any) => {
        list.services.push({name: srv.name, marked: false});
      });
      this.items.push(list);
    });
  }

  onDelete(i, j) {
    this.items[i].services[j].marked = !this.items[i].services[j].marked;
  }

  onSave() {
    const  markedIndex = [];
    this.dialogRef.close();
    this.items.forEach((item, sysIdx) => {
      item.services.forEach((srv, srvIdx) => {
        if (srv.marked) {
          markedIndex.push(sysIdx + '_' + srvIdx);
        }
      });
    });
    console.log(markedIndex);
    this.apiService.delete(markedIndex)
      .subscribe(() => {
        this.snackBar.openFromComponent(NotifierComponent, {
          horizontalPosition: 'right',
          data: { message: 'Deleted Successfully.'}
        });
      },
        (err) => {
          console.log(err);
          this.snackBar.openFromComponent(NotifierComponent, {
            horizontalPosition: 'right',
            data: { message: 'Could not able to process delete request.'}
          });
        }
      );
  }

}
