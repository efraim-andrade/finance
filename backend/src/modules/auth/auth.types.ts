export type LoginInput = {
  email: string;
  password: string;
};

export type AuthPayload = {
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  };
  token: string;
};

export type RequestPasswordResetInput = {
  email: string;
};

export type ResetPasswordInput = {
  token: string;
  password: string;
};

export type MessagePayload = {
  message: string;
};
