import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { APIService } from '../shared/api.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as AppActions from '../store/app.actions';

@Component({
  selector: 'app-save-service',
  templateUrl: './save-service.component.html',
  styleUrls: ['./save-service.component.css']
})
export class SaveServiceComponent implements OnInit {

  form = new FormGroup({
    systemName: new FormControl('', Validators.required),
    serviceName: new FormControl('', Validators.required),
    description: new FormControl('')
  });
  menuItems: any[];
  systemOptions;
  filterOptionsForSystem: Observable<any>;


  constructor(
    public dialogRef: MatDialogRef<SaveServiceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public apiService: APIService,
    public store: Store<{ appStore: any }>
  ) { }

  ngOnInit() {
    this.menuItems = [...this.apiService.fetchMenuItems()];
    this.systemOptions = this.menuItems.map((s: any) => s.name);
    console.log(this.systemOptions);
    this.filterOptionsForSystem = this.form.controls['systemName'].valueChanges.pipe(
      startWith(''),
      map(o => this.systemOptions.filter(s => s.toLowerCase().includes(o.toLowerCase())))
    );
    if (this.data.systemId !== null) {
      this.form.controls['systemName'].patchValue(this.data.systemName);
      this.form.controls['serviceName'].patchValue(this.data.serviceName);
      this.form.controls['description'].patchValue(this.data.description);
    }
  }

  onSave() {
    let sysId = this.data.systemId;
    let srvId = this.data.serviceId;
    if (this.data.systemId === null) {
      console.log(this.systemOptions);
      console.log(this.form.get('systemName').value);
      const sysLookUp = this.systemOptions.findIndex((e) => e === this.form.get('systemName').value.trim());
      if (sysLookUp === -1) {
        console.log('sys if');
        sysId = this.systemOptions.length;
        srvId = 0;
      } else {
        console.log('sys else');
        sysId = sysLookUp;
        const srvLookUp = this.menuItems[sysId].services.findIndex((e) => {
          return e === this.form.get('serviceName').value.trim();
        });
        if (srvLookUp === -1) {
          srvId = this.menuItems[sysId].services.length;
        } else {
          srvId = srvLookUp;
        }
      }
    }
      // this.store.dispatch(new AppActions.SelectedService({sysId: sysId, srvId: srvId, srvName: this.form.get('serviceName').value}));
    // } else {
      // this.store.dispatch(new AppActions.SelectedService({srvName: this.form.get('serviceName').value}));
    // }
    this.dialogRef.close({ form: {
        ...this.data,
        systemName: this.form.get('systemName').value,
        serviceName: this.form.get('serviceName').value,
        description: this.form.get('description').value
      },
      sysId: sysId,
      srvId: srvId
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

}
