import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookPartySelectDateComponent } from './book-party-select-date.component';

describe('BookPartySelectDateComponent', () => {
  let component: BookPartySelectDateComponent;
  let fixture: ComponentFixture<BookPartySelectDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookPartySelectDateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookPartySelectDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
