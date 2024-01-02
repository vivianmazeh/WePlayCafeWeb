import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyTicketsComponent } from './buy-tickets.component';

describe('BuyTicketsComponent', () => {
  let component: BuyTicketsComponent;
  let fixture: ComponentFixture<BuyTicketsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuyTicketsComponent]
    });
    fixture = TestBed.createComponent(BuyTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
