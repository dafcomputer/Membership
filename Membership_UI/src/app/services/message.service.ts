import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { environment } from "src/environments/environment";
import { ImessageGetDto, IMessagePostDto } from "../membership/pages/Message/message-list/add-message/messageDto";
import { ResponseMessageData } from "../models/ResponseMessage.Model";

@Injectable({
  providedIn: "root",
})
export class EventMessageService {
  baseUrl: string = environment.baseUrl;
  baseUrlPdf: string = environment.baseUrl;
  constructor(private http: HttpClient) {}

  addMessage(fromData: IMessagePostDto) {
    return this.http.post<ResponseMessageData<string>>(
      this.baseUrl + "/EventMessages/AddEventMessage",
      fromData
    );
  }

  getMessages(isApproved: boolean) {
    return this.http.get<ResponseMessageData<ImessageGetDto[]>>(
      this.baseUrl + `/EventMessages/GetEventMessage?isApproved=${isApproved}`
    );
  }
}
