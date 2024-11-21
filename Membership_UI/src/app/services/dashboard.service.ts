import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import {
  FilterCriteriaDto,
  DashboardNumericalDTo,
} from "../membership/pages/admin-dashbord/IDashboardDto";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getNumbericalData(filterCriteriaDto: FilterCriteriaDto) {
    let params = new HttpParams();
    for (const key in filterCriteriaDto) {
      if (
        filterCriteriaDto[key] !== null &&
        filterCriteriaDto[key] !== undefined
      ) {
        params = params.set(key, filterCriteriaDto[key]);
      }
    }

    return this.http.get<DashboardNumericalDTo>(
      this.baseUrl + "/Dashboard/GetNumbericalData",
      { params }
    );
  }
}
