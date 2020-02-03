import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiDraftComponent } from './fi-draft.component';

describe('FiDraftComponent', () => {
  let component: FiDraftComponent;
  let fixture: ComponentFixture<FiDraftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiDraftComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiDraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
