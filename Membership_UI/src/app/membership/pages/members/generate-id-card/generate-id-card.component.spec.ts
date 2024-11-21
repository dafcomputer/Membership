import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateIdCardComponent } from './generate-id-card.component';

describe('GenerateIdCardComponent', () => {
  let component: GenerateIdCardComponent;
  let fixture: ComponentFixture<GenerateIdCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenerateIdCardComponent]
    });
    fixture = TestBed.createComponent(GenerateIdCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
