export interface clientDetails {
    name: string;
    email: string;
    clientType: string;
    
    phoneNumber: number;
    password: string;
    notification: []; //pushing the message model inside
    message: {}[];
    paymentLog: {}[];
    contact_us: {}[];
    bills: {}[];
  }
  
  export interface adminDetails {
    name: string;
    email: string;
    password: string;
    message: {}[];
    notification: [];
    paymentLog: {}[];
    bills: {}[];
  }