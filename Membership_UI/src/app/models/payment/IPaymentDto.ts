export interface IPaymentData {
  amount: number;
  currency: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  return_url: string;
  title: string;
  description: string;
}

export interface Transaction {
  amount: number;
  charge?: any; // `null` in this case, so set as optional
  created_at: string;
  currency: string;
  customization: Customization;
  email: string;
  first_name: string;
  last_name: string;
  meta?: any; // `null` in this case, so set as optional
  method?: any; // `null` in this case, so set as optional
  mode: string;
  phone_number: string;
  reference?: any; // `null` in this case, so set as optional
  status: string;
  tx_ref: string;
  type: string;
  updated_at: string;

  checkout_url?: string;
}

export interface IPaymentResponse {
  message: string;
  response: {
    message: string;
    status: string;
    data: Transaction;
    tx_ref: string;
  };
}

export interface IMakePayment {
  memberId: string;
  text_Rn: string;
  payment: number;

  url: string;
  membershipTypeId: string;
}
export interface PaymentResponse {
  response: {
    message: string;
    status: string;
    data: PaymentData;
  };
  message?: string;
}

export interface PaymentData {
  first_name: string;
  last_name: string;
  email: string;
  currency: string;
  amount: number;
  charge: number;
  mode: string;
  method: string;
  type: string;
  status: string;
  reference: string;
  tx_ref: string;
  customization: Customization;
  meta: any;
  created_at: string;
  updated_at: string;
}

export interface Customization {
  title: string;
  description: string;
  logo: string | null;
}
