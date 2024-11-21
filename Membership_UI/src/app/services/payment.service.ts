import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

import { ResponseMessage } from "../models/ResponseMessage.Model";
import {
  IMakePayment,
  IPaymentData,
  IPaymentResponse,
} from "../models/payment/IPaymentDto";

@Injectable({
  providedIn: "root",
})
export class PaymentService {
  constructor(private http: HttpClient) {}
  readonly PaymentUrl = environment.paymentUrl;
  readonly BaseURI = environment.baseUrl;

  payment(paymentData: IPaymentData) {
   
    return this.http.post<IPaymentResponse>(
      this.PaymentUrl + `chapa`,
      paymentData
    );
  }
  MakePayment(paymentData: IMakePayment) {
    return this.http.post<ResponseMessage>(
      this.BaseURI + `/Member/MakePayment`,
      paymentData
    );
  }
  MakePaymentConfirmation(txt_rn: string) {
    return this.http.post<ResponseMessage>(
      this.BaseURI + `/Member/MakePaymentConfirmation?textRn=${txt_rn}`,
      {}
    );
  }

  verifyPayment(txr_rn: string) {
    return this.http.get<IPaymentResponse>(
      this.PaymentUrl + `chapa/verify-payment/${txr_rn}`
    );
  }
}
