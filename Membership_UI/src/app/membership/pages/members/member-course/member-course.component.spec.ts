import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberCourseComponent } from './member-course.component';

describe('MemberCourseComponent', () => {
  let component: MemberCourseComponent;
  let fixture: ComponentFixture<MemberCourseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MemberCourseComponent]
    });
    fixture = TestBed.createComponent(MemberCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
