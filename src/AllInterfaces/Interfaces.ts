export interface UserDetails {
    name: string;
    username: string;
    email: string;
    image: string;
    phoneNumber: number;
    password: string;
    confirmPassword: string;
    status: string;
    companyGiftCards: {}[];
    PurchasedGiftCards: {}[];
  }
  
  export interface BusinessDetails {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    status: string;
    giftCard: {}[];
  }

  export interface GiftCardDetails {
    logo: string;
    uniqueID: string;
    name: string;
    moneyWorth: number;
    purchased: boolean;
  }