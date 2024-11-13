import { TestBed } from '@angular/core/testing';

import { CSPService } from './csp.service';

describe('CSPService', () => {
  let service: CSPService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CSPService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
