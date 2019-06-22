import { Component, OnInit } from '@angular/core';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead/typeahead-match.class';
import { Store } from '@ngrx/store';
import * as AppActions from '../store/app.actions';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchableData: object[] = [];
  selected: string;

  constructor(public store: Store<{appStore: any}>, ) { }

  ngOnInit() {
    this.store
      .select(state => state.appStore.services)
      .subscribe(list => {
        list.forEach((sys, sysIdx) => {
          sys.services.forEach((srv, srvIdx) => {
            this.searchableData.push({
              keyword: sys.name.toLowerCase() + ' | ' + srv.name.toLowerCase() + ' | ' + srv.url.toLowerCase(),
              id: sysIdx + '_' + srvIdx,
              srvName: srv.name
            });
          });
        });
      });
  }

  onSelect(event: TypeaheadMatch): void {
    console.log(event.item);
    this.store.dispatch(
      new AppActions.SelectedService({
        sysId: event.item.id.split('_')[0],
        srvId: event.item.id.split('_')[1],
        srvName: event.item.srvName
      })
    );
  }
}
