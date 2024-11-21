import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PyamentDetilModalComponent } from './pyament-detil-modal.component';

describe('PyamentDetilModalComponent', () => {
  let component: PyamentDetilModalComponent;
  let fixture: ComponentFixture<PyamentDetilModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PyamentDetilModalComponent]
    });
    fixture = TestBed.createComponent(PyamentDetilModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
