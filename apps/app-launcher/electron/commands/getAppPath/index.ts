import { app } from 'electron';

/**
 * Get application path (_dirname)
 */
export const getAppPath = async () => {
  return app.getAppPath(); // or __dirname
};
