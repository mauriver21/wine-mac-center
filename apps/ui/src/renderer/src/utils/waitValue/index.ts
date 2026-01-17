export const waitValue = <T extends { [key: string]: any }>(value: T, key: keyof T) => {
  let intervalId: NodeJS.Timeout;
  return new Promise<T[keyof T]>((resolve) => {
    intervalId = setInterval(() => {
      console.log(value, key);
      if (value[key]) {
        clearInterval(intervalId);
        resolve(value[key]);
      }
    }, 100);
  });
};
