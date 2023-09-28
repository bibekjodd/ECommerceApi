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
