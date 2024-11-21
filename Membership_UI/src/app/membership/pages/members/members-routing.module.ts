import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MembersComponent } from "./members.component";
import { MemberProfileComponent } from "./member-profile/member-profile.component";
import { MemberAnnouncmentsComponent } from "./member-announcments/member-announcments.component";
import { MemberCourseComponent } from "./member-course/member-course.component";
import { RequestedIdcardsComponent } from "./requested-idcards/requested-idcards.component";
import { MessageListComponent } from "../Message/message-list/message-list.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "List",
        component: MembersComponent,
      },
      {
        path: "member-profile",
        component: MemberProfileComponent,
      },
      {
        path: "member-announcment",
        component: MemberAnnouncmentsComponent,
      },
      {
        path: "member-course",
        component: MemberCourseComponent,
      },
      {
        path: "idcard",
        component: RequestedIdcardsComponent,
      },
      {
        path: "messages",
        component: MessageListComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MembersRoutingModule {}
