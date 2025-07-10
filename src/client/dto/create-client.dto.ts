export class CreateClientDTO {
    readonly name: string;
    readonly phone: string;
    readonly email: string;
    readonly emailConfirm: boolean;
    readonly data: string;
    readonly status: string;
    readonly password: string;
}