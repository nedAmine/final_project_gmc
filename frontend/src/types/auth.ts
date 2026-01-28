export interface LoginPL {
  loginOrEmail: string;
  password: string;
}

export interface registerUser {
  email: string;
  code: string;
  login: string;
  firstname: string;
  lastname: string;
  password: string;
  phone1: string;
  phone2: string;
  address: string;
}

export interface editPasswordPL {
  oldPassword: string;
  newPassword: string;
}