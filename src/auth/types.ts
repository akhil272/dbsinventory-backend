type jwt = {
  expiresIn: number;
  secret: string;
};

type otp = {
  window: number;
  digits: number;
  step: number;
  secret?: string;
};

export { jwt, otp };
