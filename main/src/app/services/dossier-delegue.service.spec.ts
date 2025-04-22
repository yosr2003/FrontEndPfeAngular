import { TestBed } from '@angular/core/testing';

import { DossierDelegueService } from './dossier-delegue.service';

describe('DossierDelegueService', () => {
  let service: DossierDelegueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DossierDelegueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
