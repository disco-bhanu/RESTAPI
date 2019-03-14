import { Component, OnInit } from '@angular/core';

import { Subject, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as AppActions from '../../store/app.actions';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  $searchString = new Subject();
  searchString;
  searchableData: object[] = [];
  searchCtrl = new FormControl();
  filteredSearch: Observable<any>;
  apilist = [];

  constructor(public store: Store<{appStore: any}>) {}

  ngOnInit() {
    /* this.apiService.searchableItems.subscribe((items: any) => {
      items.forEach((sys: any) => {
        sys.services.forEach( srv => {
          this.searchableData.push({
            keyword: sys.name.toLowerCase() + ' | ' + srv.name.toLowerCase() + ' | ' + srv.url.toLowerCase(),
            id: sys.id + '_' + srv.id
          });
        });
      });
    }); */

    this.store.select(state => state.appStore.services).subscribe(
      list => {
        list.forEach((sys) => {
          sys.services.forEach(srv => {
            this.searchableData.push({
              keyword: sys.name.toLowerCase() + ' | ' + srv.name.toLowerCase() + ' | ' + srv.url.toLowerCase(),
              id: sys.id + '_' + srv.id,
              srvname: srv.name
            });
          });
        });
      }
    );
    this.filteredSearch = this.searchCtrl.valueChanges
      .pipe(
        startWith(''),
        map(keyword => this.searchableData.filter((s: any) => s.keyword.includes(keyword.toLowerCase())))
      );
  }

  onSelect(key) {
    console.log(key);
    const search: any = this.searchableData.filter((s: any) => s.keyword.includes(key.toLowerCase()))[0];
    console.log(search.id);
    // this.apiService.selectAPIByID(id);
    this.store.dispatch(new AppActions.SelectedService({
      sysid: search.id.split('_')[0],
      srvid: search.id.split('_')[1],
      srvname: search.srvname
    }));
  }

  onClearSearch() {
    this.searchCtrl.patchValue('');
  }

}
