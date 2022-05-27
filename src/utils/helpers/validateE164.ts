const validE164 = (num: string) => {
  return /^\+?[1-9]\d{1,14}$/.test(num);
};

export default validE164;
