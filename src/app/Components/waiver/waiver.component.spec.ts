import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaiverComponent } from './waiver.component';

describe('CafeComponent', () => {
  let component: WaiverComponent;
  let fixture: ComponentFixture<WaiverComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WaiverComponent]
    });
    fixture = TestBed.createComponent(WaiverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
