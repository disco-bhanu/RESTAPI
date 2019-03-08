import { Component } from '@angular/core';

import { Subject } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { APIService } from '../../shared/api.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {

  $searchString = new Subject();

  searchString;

  constructor(private apiService: APIService) {
    this.$searchString.pipe(
      map(e => e.toString()),
      debounceTime(1000),
      distinctUntilChanged(),
    );
    this.$searchString.subscribe( (s: string) => {
      if (s.trim().length > 0) {
        this.apiService.fetchMenuItemsBySearch(s);
      } else {
        this.apiService.fetchMenuItems();
      }
    })
    ;
  }

  onClearSearch() {
    this.searchString = '';
    this.apiService.fetchMenuItems();
  }

}
