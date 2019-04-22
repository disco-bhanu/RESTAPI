import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

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

  constructor(public dialogRef: MatDialogRef<SaveServiceComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    if (this.data.systemId !== null) {
      this.form.controls['systemName'].patchValue(this.data.systemName);
      this.form.controls['serviceName'].patchValue(this.data.serviceName);
      this.form.controls['description'].patchValue(this.data.description);
    }
  }

  onSave() {
    this.dialogRef.close({
      ...this.data,
      systemName: this.form.get('systemName').value,
      serviceName: this.form.get('serviceName').value,
      description: this.form.get('description').value
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

}
