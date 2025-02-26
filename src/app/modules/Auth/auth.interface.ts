export type TUser ={
    name:string,
    pin:string,
    mobileNumber:string,
    email:string,
    role: "user" | "agent" | "admin",
    nid:string,
    balance?:number,
    isBlocked:boolean,
    approval:boolean,
  

}