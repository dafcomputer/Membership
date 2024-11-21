import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { UserService } from "src/app/services/user.service";

import { HttpClientModule } from "@angular/common/http";
import { UserView } from "src/app/models/auth/userDto";
import { errorToast } from "src/app/services/toast.service";
@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, HttpClientModule],
  providers: [],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export default class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  user!: UserView;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      userName: ["", Validators.required],
      password: ["", Validators.required],
      IsEncryptChecked: [false, Validators.required],
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.userService.login(this.loginForm.value).subscribe({
        next: (res) => {
          if (res.success) {
            sessionStorage.setItem("token", res.data);
            this.router.navigateByUrl("/admin-dashboard");
          } else {
            errorToast(res.errorCode! || res.message, res.message);
          }
        },
      });
    }
  }

  loginasMember() {
    this.router.navigateByUrl("/auth/membership-login");
  }
}
