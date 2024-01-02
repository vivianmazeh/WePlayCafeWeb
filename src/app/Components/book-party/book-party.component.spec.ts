import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookPartyComponent } from './book-party.component';

describe('BookPartyComponent', () => {
  let component: BookPartyComponent;
  let fixture: ComponentFixture<BookPartyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookPartyComponent]
    });
    fixture = TestBed.createComponent(BookPartyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
