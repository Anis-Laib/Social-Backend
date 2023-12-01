import 'dotenv/config';
export declare const verifyWsToken: (token: string) => Promise<false | {
    id: string;
    username: string;
    email: string;
    profilePicture: string;
    firstname: string;
    lastname: string;
    bio: string;
    phone: string;
    dateOfBirth: Date;
    createdAt: Date;
}>;
