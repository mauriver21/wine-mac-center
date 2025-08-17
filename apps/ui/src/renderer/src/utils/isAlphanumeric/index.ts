export const isAlphanumeric = (input: string): boolean => {
  const regex = /^[a-zA-Z0-9 ]+$/;
  return regex.test(input);
};
