import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerNamesComponent } from './server-names.component';

describe('ServerNamesComponent', () => {
  let component: ServerNamesComponent;
  let fixture: ComponentFixture<ServerNamesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServerNamesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerNamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
