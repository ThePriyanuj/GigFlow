export declare enum UserRole {
    ADMIN = "admin",
    SALES = "sales"
}
export interface IUser {
    _id: string;
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
}
export interface ILoginRequest {
    email: string;
    password: string;
}
export interface IRegisterRequest {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
}
export interface IAuthResponse {
    success: boolean;
    token: string;
    user: Omit<IUser, 'password'>;
}
export interface ITokenPayload {
    userId: string;
    email: string;
    role: UserRole;
}
//# sourceMappingURL=auth.types.d.ts.map