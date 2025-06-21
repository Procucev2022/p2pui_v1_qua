import { TestBed, inject } from '@angular/core/testing';

import { BfsItemsService } from './bfs-items.service';

describe('BfsItemsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BfsItemsService]
    });
  });

  it('should be created', inject([BfsItemsService], (service: BfsItemsService) => {
    expect(service).toBeTruthy();
  }));
});
