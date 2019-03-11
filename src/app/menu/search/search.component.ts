import { Component, OnInit } from '@angular/core';

import { Subject, Observable } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import { APIService } from '../../shared/api.service';
import { FormControl } from '@angular/forms';

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

  constructor(private apiService: APIService) {}

  ngOnInit() {
    this.apiService.searchableItems.subscribe((items: any) => {
      items.forEach((sys: any) => {
        sys.services.forEach( srv => {
          this.searchableData.push({
            keyword: sys.name.toLowerCase() + ' | ' + srv.name.toLowerCase() + ' | ' + srv.url.toLowerCase(),
            id: sys.id + '_' + srv.id
          });
        });
      });
    });
    this.filteredSearch = this.searchCtrl.valueChanges
      .pipe(
        startWith(''),
        map(keyword => this.searchableData.filter((s: any) => s.keyword.includes(keyword.toLowerCase())))
      );
  }

  onSelect(id) {
    this.apiService.selectAPIByID(id);
  }

  onClearSearch() {
    this.searchString = '';
  }

}
