export interface UserDetails {
    name: string;
    username: string;
    email: string;
    phoneNumber: number;
    password: string;
    confirmPassword: string;
    companyGiftCards: {}[];
    PurchasedGiftCards: {}[];
  }
  
  export interface BusinessDetails {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    giftCard: {}[];
  }

  export interface GiftCardDetails {
    logo: string;
    uniqueID: string;
    name: string;
    moneyWorth: number;
  }