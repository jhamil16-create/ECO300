export interface User {
    ID_Usuario: number;
    Nombre: string;
    Email: string;
    Rol: string;
    email_verified_at?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
