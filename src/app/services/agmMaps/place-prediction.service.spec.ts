import { TestBed } from '@angular/core/testing';

import { PlacePredictionService } from './place-prediction.service';

describe('PlacePredictionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlacePredictionService = TestBed.get(PlacePredictionService);
    expect(service).toBeTruthy();
  });
});
