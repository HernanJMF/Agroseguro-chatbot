import { TestBed } from '@angular/core/testing';

import { WebViewService } from './web-view.service';

describe('WebViewService', () => {
  let service: WebViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
