export interface IMobileAppReadingDto {
    custId: string;
    readerName: string;
    mobile: string;
    contractNo: string;
    customerName: string;
    prevReading?: number;
    fiscalYear?: number;
    monthIndex?: number;
    prevTotalCost?: number;
    month: string;
    monthnamelocal: string;
  }