export interface IUser {
    id: string;
    username: string;
    email: string;
    password: string;
    repeatPassword?: string | undefined;
    firstname: string;
    lastname: string;
    profilePicture?: string | undefined;
    bio?: string | undefined;
    phone?: string | undefined;
    dateOfBirth?: Date | undefined;
}