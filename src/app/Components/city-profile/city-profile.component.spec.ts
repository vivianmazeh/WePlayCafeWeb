import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CityProfileComponent } from './city-profile.component';

describe('CityProfileComponent', () => {
  let component: CityProfileComponent;
  let fixture: ComponentFixture<CityProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CityProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CityProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
