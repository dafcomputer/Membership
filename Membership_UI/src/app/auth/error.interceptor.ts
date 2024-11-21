import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { errorToast } from "../services/toast.service";
import { AuthGuard } from "./auth.guard";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authGuard: AuthGuard) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        const { errorMessage, errorDetail } = this.extractErrorDetails(err);

        if (err.status === 401) {
          this.authGuard.logout();
          location.reload();
        }

        // Show error message in SweetAlert2 toast
        errorToast(errorMessage, errorDetail);

        return throwError(() => new Error(errorMessage));
      })
    );
  }

  private extractErrorDetails(err: HttpErrorResponse): {
    errorMessage: string;
    errorDetail: string;
  } {
    let errorMessage = "An unexpected error occurred.";
    let errorDetail = "No additional error details are available.";

    if (err.error) {
      switch (err.status) {
        case 400:
          errorMessage = err.error.title || "Bad Request";
          errorDetail = this.parseValidationErrors(err.error.errors);
          break;
        case 401:
          errorMessage = "Unauthorized access. Please log in again.";
          errorDetail = "You have been logged out due to unauthorized access.";
          break;
        case 404:
          errorMessage = "Requested resource not found.";
          errorDetail =
            "The resource you are looking for does not exist or has been moved.";
          break;
        case 500:
          errorMessage = err.error.title || "Internal Server Error";
          errorDetail =
            err.error ||
            "An unexpected error occurred on the server. Please try again later.";
          break;

        default:
          if (err.error.message) {
            errorMessage = err.error.message;
          } else if (err.error.title) {
            errorMessage = err.error.title;
          }
          break;
      }
    } else if (err.message) {
      switch (err.status) {
        case 401:
          errorMessage = "Unauthorized access. Please log in again.";
          errorDetail = "You have been logged out due to unauthorized access.";
          break;
        case 404:
          errorMessage = "Requested resource not found.";
          errorDetail =
            "The resource you are looking for does not exist or has been moved.";
          break;
        default:
          errorMessage = err.message;
          break;
      }
    }

    return { errorMessage, errorDetail };
  }

  private parseValidationErrors(errors: any): string {
    if (!errors) return "No additional error details are available.";
    if (typeof errors === "object" && !Array.isArray(errors)) {
      return Object.keys(errors)
        .map((key) => {
          const error = errors[key];
          return Array.isArray(error) ? error.join(", ") : error;
        })
        .join(" | ");
    } else if (Array.isArray(errors)) {
      return errors.join(", ");
    }
    return "No additional error details are available.";
  }
}
