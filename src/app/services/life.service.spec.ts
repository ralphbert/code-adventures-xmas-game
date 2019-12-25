import { TestBed } from '@angular/core/testing';

import { LifeService } from './life.service';

describe('LifeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LifeService = TestBed.get(LifeService);
    expect(service).toBeTruthy();
  });
});
