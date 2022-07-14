export interface iAccount{
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    photo?: string;
}

export interface iUpdateAccount{
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    photo?: string;
}