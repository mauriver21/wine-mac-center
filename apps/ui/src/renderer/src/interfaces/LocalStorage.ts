export type LocalStorage =
  | {
      key: 'steamCredentials';
      data: { userName: string; password: string };
    }
  | {
      key: 'lang';
      data: { lang: string };
    };
