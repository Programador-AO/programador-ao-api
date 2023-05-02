export interface AuthInterface {
  email: string;
  password: string;
}

export interface LoginEmailPasswordResponseInterface {
  usuario: any;
  token: string;
}

export interface RegisteEmailPasswordResponseInterface {
  usuario: any;
  token: string;
}
