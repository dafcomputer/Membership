import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewMemberComponent } from './renew-member.component';

describe('RenewMemberComponent', () => {
  let component: RenewMemberComponent;
  let fixture: ComponentFixture<RenewMemberComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RenewMemberComponent]
    });
    fixture = TestBed.createComponent(RenewMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
