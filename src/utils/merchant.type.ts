export interface Merchant {
  isRegistered: boolean;
  stakedBalance: string;
  rewardBalance: string;
  merchantAddress: string;
}

export interface MerchantInfo {
  address: string;
  businessName: string;
  businessDescription: string;
  phoneNumber: string;
  email: string;
  lastName: string;
  firstName: string;
}
