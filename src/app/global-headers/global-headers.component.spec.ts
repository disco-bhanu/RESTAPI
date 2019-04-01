import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalHeadersComponent } from './global-headers.component';

describe('GlobalHeadersComponent', () => {
  let component: GlobalHeadersComponent;
  let fixture: ComponentFixture<GlobalHeadersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalHeadersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalHeadersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
