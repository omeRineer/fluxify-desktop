export interface AccessToken {
    token:string;
    expireDate:Date;
}


export interface LoginRequest{
    userName:string;
    password:string;
}