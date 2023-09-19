import { TestBed } from '@angular/core/testing';

import { CursosMoodleService } from './cursos-moodle.service';

describe('CursosMoodleService', () => {
  let service: CursosMoodleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CursosMoodleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
