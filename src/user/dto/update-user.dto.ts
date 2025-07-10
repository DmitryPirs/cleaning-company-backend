export class UpdateUserDTO {
  readonly userName?: string;
  readonly phone?: string;
  readonly email?: string;
  readonly emailConfirm?: boolean;
  readonly data?: string;
  readonly status?: string;
  readonly role?: string;
  readonly password?: string;
}
