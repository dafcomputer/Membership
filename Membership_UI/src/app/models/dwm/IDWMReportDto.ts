export interface IDWMReadingLogReportDto {
    readerName: string;
    userName: string;
    customerName: string;
    meterNo: string;
    contractNo?: string;
    previous?: number;
    current?: number;
    consumption?: number;
    average?: number;
    status: string;
    monthIndex?: number;
    fiscalYear?: number;
  }

  export interface IDWMPendingLogReportDto{
    contractNo:string
    meterNo:string
    userName:string
    customerName:string
    readerName:string
  }
  export interface IDwmReadingAccuracyReportDto {
    readerName: string;
    userName: string;
    aboveAVG: number;
    belowAVG: number;
    normal: number;
}
 
export interface IDwmReadingEfficencyReportDto {
    readerName: string;
    userName: string;
    totalCustomers: number;
    readed:number

   
}
export interface IDwmReadingConsumptionReportDto {
    readerName: string;
    userName: string;
    consumption: number;
  

   
}


   
