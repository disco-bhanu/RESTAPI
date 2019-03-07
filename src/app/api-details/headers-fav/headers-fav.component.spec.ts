import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadersFavComponent } from './headers-fav.component';

describe('HeadersFavComponent', () => {
  let component: HeadersFavComponent;
  let fixture: ComponentFixture<HeadersFavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeadersFavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadersFavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
