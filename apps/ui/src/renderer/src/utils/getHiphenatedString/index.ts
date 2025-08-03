export const getHiphenatedString = (text: string) => {
  let result = '';
  try {
    const arr = text.trim().split(' ');
    for (const piece of arr) {
      result += `${piece}-`;
    }
  } finally {
    return result.replace(/-$/, '');
  }
};
