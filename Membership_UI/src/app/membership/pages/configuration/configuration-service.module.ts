import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { ConfigurationServiceRoutingModule } from "./configuration-routing.module";
import { LocationSettingComponent } from "./location-setting/location-setting.component";
import { MembershipTypesComponent } from "./membership-types/membership-types.component";
import { RegionComponent } from "./location-setting/region/region.component";
import { AddRegionComponent } from "./location-setting/region/add-region/add-region.component";

import { AddMembershipTypeComponent } from "./membership-types/add-membership-type/add-membership-type.component";
import { CourseComponent } from "./course/course.component";
import { AnnouncmentComponent } from "./announcment/announcment.component";
import { AddCourseComponent } from "./course/add-course/add-course.component";
import { AddAnnouncmentComponent } from "./announcment/add-announcment/add-announcment.component";
import { EventDescriptionComponent } from "./event-description/event-description.component";

@NgModule({
  declarations: [
    LocationSettingComponent,
    MembershipTypesComponent,
    RegionComponent,
    AddRegionComponent,
    AddMembershipTypeComponent,
    CourseComponent,
    AnnouncmentComponent,
    AddCourseComponent,
    AddAnnouncmentComponent,
    EventDescriptionComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ConfigurationServiceRoutingModule,
    ReactiveFormsModule,
  ],
})
export class ConfigurationServiceModule {}
