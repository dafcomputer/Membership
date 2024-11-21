import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterMembersAdminComponent } from './register-members-admin.component';

describe('RegisterMembersAdminComponent', () => {
  let component: RegisterMembersAdminComponent;
  let fixture: ComponentFixture<RegisterMembersAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterMembersAdminComponent]
    });
    fixture = TestBed.createComponent(RegisterMembersAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
