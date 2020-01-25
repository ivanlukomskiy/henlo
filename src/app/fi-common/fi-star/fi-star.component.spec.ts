import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiStarComponent } from './fi-star.component';

describe('FiStarComponent', () => {
  let component: FiStarComponent;
  let fixture: ComponentFixture<FiStarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiStarComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiStarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
