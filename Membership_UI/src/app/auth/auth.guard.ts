import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";
import { UserService } from "../services/user.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private service: UserService
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (
      sessionStorage.getItem("token") != null &&
      sessionStorage.getItem("token") != ""
    ) {
      let roles = next.data["permittedRoles"] as Array<string>;

      if (roles) {
        if (this.service.roleMatch(roles)) return true;
        else {
          //on-construction
          this.router.navigate(["/auth/membership-login"]);
          //this.router.navigate(['/on-construction']);
          return false;
        }
      }
      return true;
    } else {
      this.router.navigate(["/auth/membership-login"]);
      //this.router.navigate(['/on-construction']);
      return false;
    }
  }
  logout() {
    sessionStorage.setItem("token", "");
    window.location.reload();
  }
}
