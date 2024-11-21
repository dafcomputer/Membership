import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminComponent } from "./theme/layout/admin/admin.component";
import { GuestComponent } from "./theme/layout/guest/guest.component";
import { AuthGuard } from "./auth/auth.guard";
import { MembersDashboardComponent } from "./membership/pages/members/members-dashboard/members-dashboard.component";
import AdminDashbordComponent from "./membership/pages/admin-dashbord/admin-dashbord.component";
import { LandingPageComponent } from "./membership/pages/landing-page/landing-page.component";

const routes: Routes = [
  {
    path: "",
    component: LandingPageComponent,
  },
  {
    path: "",
    canActivate: [AuthGuard],
    component: AdminComponent,
    children: [
     

      {
        path: "admin-dashboard",
        component: AdminDashbordComponent,
      },
      {
        path: "member-dashboard",
        component: MembersDashboardComponent,
      },

      {
        path: "configuration",
        loadChildren: () =>
          import(
            "./membership/pages/configuration/configuration-service.module"
          ).then((m) => m.ConfigurationServiceModule),
      },
      {
        path: "members",
        loadChildren: () =>
          import("./membership/pages/members/members.module").then(
            (m) => m.MembersModule
          ),
      },
      {
        path: "reports",
        loadChildren: () =>
          import("./membership/pages/reports/reports.module").then(
            (m) => m.ReportsModule
          ),
      },
    ],
  },

  {
    path: "on-construction",
    //component: OnConstructionComponent,
  },
  {
    path: "board-member-dashboard",
    // component: BoardMemberDashbaordComponent,
  },
  {
    path: "",
    component: GuestComponent,
    children: [
      {
        path: "auth",
        loadChildren: () =>
          import(
            "./membership/pages/authentication/authentication.module"
          ).then((m) => m.AuthenticationModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
