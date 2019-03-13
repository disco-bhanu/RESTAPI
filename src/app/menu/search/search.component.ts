import { Component, OnInit } from '@angular/core';

import { Subject, Observable } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import { APIService } from '../../shared/api.service';
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

  constructor(private apiService: APIService, public store: Store<{appStore: any}>) {}

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
              id: sys.id + '_' + srv.id
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

  onSelect(e, id) {
    console.log(e);
    // this.apiService.selectAPIByID(id);
    this.store.dispatch(new AppActions.SelectedService({
      sysid: id.split('_')[0],
      srvid: id.split('_')[1]
    }));
  }

  selected(e) {
    console.log(e);
  }

  onClearSearch() {
    this.searchCtrl.patchValue('');
  }

}
