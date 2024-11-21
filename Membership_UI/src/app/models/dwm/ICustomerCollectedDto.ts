export interface ICustomerCollectedDto {
    customerName: string;
    meterNo: string;
    custId: string;
    readingPrev?: number;
    readingCurrent?: number;
    readingAvg?: number;
    readingImage: string;
    consumption?: number;
    readingReasonCode: string;
    fullName: string;
    userName: string;
    entryDT?: Date;
    readingDT?: Date;
    latitude?: number;
    longitude?: number;
    contractNo: string;
}