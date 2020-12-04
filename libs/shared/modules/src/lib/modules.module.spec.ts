import { async, TestBed } from '@angular/core/testing';
import { SharedModules } from './modules.module';

describe('SharedModules', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModules]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedModules).toBeDefined();
  });
});
