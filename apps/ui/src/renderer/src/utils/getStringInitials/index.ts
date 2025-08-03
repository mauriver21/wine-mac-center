export const getStringInitials = (text: string) => {
  let result = '';
  try {
    const arr = text.split(' ');
    for (const piece of arr) {
      result += `${piece.charAt(0)}`;
    }
  } finally {
    return result;
  }
};
