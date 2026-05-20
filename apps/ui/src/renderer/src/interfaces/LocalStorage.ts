export type LocalStorage =
  | {
      key: 'steamCredentials';
      data: { userName: string; password: string };
    }
  | {
      key: 'language';
      data: { language: string };
    };
