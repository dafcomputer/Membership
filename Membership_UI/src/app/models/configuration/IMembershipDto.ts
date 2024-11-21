export interface IMembershipTypePostDto {
    id?:string
    name: string;
    shortCode:String
    counter: number;
    money: number;
    currency : string;
    description: string;
    membershipCategory: string;
    createdById?: string;
  }
  
  export interface IMembershipTypeGetDto {
    id: string;
    name: string;
    shortCode:String
    counter: number;
    money: number;
    currency : string;
    description: string;
    membershipCategory: string;
  }

  export interface IRegionRevenueDto {
    regionRevenue:number,
    regionName:string,
    members:number
  }