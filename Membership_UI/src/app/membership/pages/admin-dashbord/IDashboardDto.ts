export interface DashboardNumericalDTo {
  totalMembers: number;
  pendingMembers: number;
  revenue: number;
  receivable: number;
}

export interface FilterCriteriaDto {
  regionId: string;
  gender: string;
  paymentStatus: string;
}
