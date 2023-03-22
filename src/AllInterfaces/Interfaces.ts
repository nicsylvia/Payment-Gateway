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
    logo: string;
    phoneNumber: number;
    password: string;
    confirmPassword: string;
    BusinessCode: string;
    status: string;
    giftCard: {}[];
  }

  export interface GiftCardDetails {
    name: string;
    BrandLogo: string;
    uniqueID: string;
    moneyWorth: number;
  }