export interface IMessagePostDto {
  content: string;
  messageType: number;
}

export interface ImessageGetDto extends IMessagePostDto {
  messageId: string;
  messageTypeGet: string;
  isApproved: boolean;
}
