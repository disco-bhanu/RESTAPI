import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { map, debounceTime, filter, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { APIService } from '../../shared/api.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  $searchString = new Subject();

  form: FormGroup = new FormGroup({
    search : new FormControl(null)
  });

  searchString;

  constructor(private apiService: APIService) {
    this.$searchString.pipe(
      map(e => console.log(e)),
      // filter((text) => text.length > 0),
      debounceTime(10),
      distinctUntilChanged(),
      // switchMap( () => conso)
    );
    this.$searchString.subscribe( s => {
      // s.pipe()
      console.log(s);
    })
    ;
  }

  ngOnInit() {
  }

  onSearch() {
    console.log(this.form.get('search').value);
    console.log(this.apiService.fetchMenuItemsBySearch(this.form.get('search').value) );
  }

  onClearSearch() {
    this.searchString = '';
    this.form.reset();
    this.apiService.fetchMenuItems();
  }

}
