import { TestBed } from '@angular/core/testing';

import { ChatAnalyzerService } from './chat-analyzer.service';

describe('ChatAnalyzerService', () => {
  let service: ChatAnalyzerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatAnalyzerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
