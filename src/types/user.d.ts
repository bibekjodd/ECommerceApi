export interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  avatar?: {
    public_id?: string;
    url?: string;
  };
  emailVerified: boolean;
  role: "user" | "admin";
  resetPasswordToken?: string;
  resetPasswordExpire?: number;
  createdAt: NativeDate;
  updatedAt: NativeDate;
}

type RegisterUserBody = Partial<{
  name: string;
  email: string;
  password: string;
  avatar: string;
}>;

type LoginUserBody = Partial<{
  email: string;
  password: string;
}>;

type UpdateProfileBody = Partial<{
  name: string;
  email: string;
  avatar: string;
  password: string;
}>;
