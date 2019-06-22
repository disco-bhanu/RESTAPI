import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-notifier',
  templateUrl: './notifier.component.html',
  styleUrls: ['./notifier.component.css']
})
export class NotifierComponent implements OnInit {

  type = null;
  message = null;
  show = false;

  constructor(public store: Store<{appStore: any}>) { }

  ngOnInit() {
    this.store.select( state => state.appStore.notification)
      .subscribe( alert => {
        console.log(alert);
        this.type = alert.type;
        this.message = alert.message;
        this.show = alert.show;
      });
  }

  onHide() {
    this.show = false;
  }

}
