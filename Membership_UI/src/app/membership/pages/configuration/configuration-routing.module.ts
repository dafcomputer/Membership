import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MembershipTypesComponent } from './membership-types/membership-types.component';

import { LocationSettingComponent } from './location-setting/location-setting.component';
import { AnnouncmentComponent } from './announcment/announcment.component';

import { EventDescriptionComponent } from './event-description/event-description.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'membership-types',
        component: MembershipTypesComponent
      },
  
      {
        path: 'location-setting',
        component: LocationSettingComponent
      },
      {
        path: 'announcment',
        component: AnnouncmentComponent
      },
      {
        path:'event-detail/:eventId',
        component:EventDescriptionComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationServiceRoutingModule {}
