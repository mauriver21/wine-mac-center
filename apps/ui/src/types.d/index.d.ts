declare namespace NodeJS {
  interface ProcessEnv {
    VITE_APP_ENV?: 'development' | 'integration' | 'production' | 'test';
  }
}
