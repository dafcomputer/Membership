export interface IDWMDashboardDto {
    totalCustomers: number;
    gpsEncoded: number;
    readed: number;
    pending: number;
    readingTypeRatio: IReadingTypeRatioDto;
    annuallyConsumption: IAnnuallyConsumptionDto[];
  }
  
  export interface IReadingTypeRatioDto {
    id: number;
    aboveAVG: number;
    belowAVG: number;
    normal: number;
    zeroReading: number;
    reasonOfCode: number;
    totalReading: number;
  }
  
  export interface IAnnuallyConsumptionDto {
    consumption?: number;
    month_Name: string;
    fiscalYear?: number;
  }