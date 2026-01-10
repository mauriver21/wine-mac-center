export const handleError = (error: unknown) => {
  console.error(error);
  if (typeof error === 'string') {
    return error;
  } else if (error instanceof Error) {
    return error.message;
  } else {
    return 'An unknown error occurred.';
  }
};
