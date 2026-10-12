export type UserContextInfo = {
    NameIdentifier:string | null;
    Key:string | null;
    Name:string | null;
    Device:string | null;
    Platform:string | null;
    NameSpaceId:string | null;
    NameSpace:string | null;
    Token: string |null;
    isAuthenticated:boolean;
    Date:Date | null;
}

export const INITIAL_USER_CONTEXT: UserContextInfo = {
    NameIdentifier: null,
    Key: null,
    Name: null,
    Device: null,
    Platform: null,
    NameSpaceId: null,
    NameSpace: null,
    Token: null,
    isAuthenticated: false,
    Date: null
};