import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AdminComponent } from "./theme/layout/admin/admin.component";
import { NavigationItem } from "./theme/layout/admin/navigation/navigation";
import { NavBarComponent } from "./theme/layout/admin/nav-bar/nav-bar.component";
import { NavLeftComponent } from "./theme/layout/admin/nav-bar/nav-left/nav-left.component";
import { NavRightComponent } from "./theme/layout/admin/nav-bar/nav-right/nav-right.component";
import { NavigationComponent } from "./theme/layout/admin/navigation/navigation.component";
import { NavLogoComponent } from "./theme/layout/admin/nav-bar/nav-logo/nav-logo.component";
import { NavContentComponent } from "./theme/layout/admin/navigation/nav-content/nav-content.component";
import { NavGroupComponent } from "./theme/layout/admin/navigation/nav-content/nav-group/nav-group.component";
import { NavCollapseComponent } from "./theme/layout/admin/navigation/nav-content/nav-collapse/nav-collapse.component";
import { NavItemComponent } from "./theme/layout/admin/navigation/nav-content/nav-item/nav-item.component";
import { SharedModule } from "./theme/shared/shared.module";
import { ConfigurationComponent } from "./theme/layout/admin/configuration/configuration.component";
import { GuestComponent } from "./theme/layout/guest/guest.component";
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from "@angular/common/http";
import { AuthHeaderIneterceptor } from "./http-interceptors/auth-header-interceptor";
import { ErrorInterceptor } from "./auth/error.interceptor";
import AdminDashbordComponent from "./membership/pages/admin-dashbord/admin-dashbord.component";
import { QRCodeModule } from "angularx-qrcode";
import { NgApexchartsModule } from "ng-apexcharts";
import * as echarts from "echarts";
import { NgxEchartsModule } from "ngx-echarts";
import { LandingPageComponent } from "./membership/pages/landing-page/landing-page.component";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    NavBarComponent,
    NavLeftComponent,
    NavRightComponent,
    NavigationComponent,
    NavLogoComponent,
    NavContentComponent,
    NavGroupComponent,
    NavItemComponent,
    NavCollapseComponent,
    ConfigurationComponent,
    GuestComponent,

    AdminDashbordComponent,
    LandingPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgApexchartsModule,
    QRCodeModule,
    NgxEchartsModule.forRoot({ echarts }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHeaderIneterceptor,
      multi: true,
    },
    NavigationItem,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
