export interface IUser {
  _id: string;
  username: string;
  password?: string;
  isAdmin: boolean;
}

export interface IUserResolved {
  user: IUser;
  error?: any;
}

export interface IUsersResolved {
  users: IUser[];
  error?: any;
}

