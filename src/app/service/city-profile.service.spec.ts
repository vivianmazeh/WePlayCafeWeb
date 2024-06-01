import { TestBed } from '@angular/core/testing';

import { CityProfileService } from './city-profile.service';

describe('CityProfileService', () => {
  let service: CityProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CityProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
