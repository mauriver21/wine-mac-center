export const parseJson = <T = any>(value: any): T | undefined => {
  if (typeof value === 'object') return value as T;

  let parsedData: T | undefined;
  try {
    parsedData = JSON.parse(value);
  } catch (error) {
    error;
  } finally {
    return parsedData;
  }
};
