import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MembershipTypesComponent } from './membership-types/membership-types.component';

import { LocationSettingComponent } from './location-setting/location-setting.component';
import { AnnouncmentComponent } from './announcment/announcment.component';

import { EventDescriptionComponent } from './event-description/event-description.component';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { ContactUsComponent } from './contact-us/contact-us.component';

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
        path: 'company-profile',
        component: CompanyProfileComponent
      },

      {
        path: 'contact-us',
        component: ContactUsComponent
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
