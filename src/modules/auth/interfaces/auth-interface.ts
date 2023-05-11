export interface AuthInterface {
  email: string;
  password: string;
}

export interface LoginResponseInterface {
  usuario: any;
  token: string;
}

export interface RegisteEmailPasswordResponseInterface {
  usuario: any;
  token: string;
}
