import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { map, startWith, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as AppActions from '../store/app.actions';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchableData: object[] = [];
  searchCtrl = new FormControl();
  filteredSearch: Observable<any>;

  constructor(public store: Store<{ appStore: any }>) {}

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
    this.filteredSearch = this.searchCtrl.valueChanges.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      map(keyword =>
        this.searchableData.filter((s: any) =>
          s.keyword.includes(keyword.toLowerCase())
        )
      )
    );
  }

  onSelect(key) {
    const search: any = this.searchableData.filter((s: any) =>
      s.keyword.includes(key.toLowerCase())
    )[0];
    this.store.dispatch(
      new AppActions.SelectedService({
        sysId: search.id.split('_')[0],
        srvId: search.id.split('_')[1],
        srvName: search.srvName
      })
    );
  }

  onClearSearch() {
    this.searchCtrl.patchValue('');
  }
}
