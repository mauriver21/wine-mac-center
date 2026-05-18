export const waitValue = <T extends { [key: string]: any }, K extends keyof T>(
  value: T,
  key: K
) => {
  let intervalId: NodeJS.Timeout;
  return new Promise<T[K]>((resolve) => {
    intervalId = setInterval(() => {
      if (value[key]) {
        clearInterval(intervalId);
        resolve(value[key]);
      }
    }, 100);
  });
};
