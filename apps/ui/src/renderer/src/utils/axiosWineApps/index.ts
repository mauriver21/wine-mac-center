import { WINE_APPS_SRC_URL } from '@constants/urls';
import axios from 'axios';

export const axiosWineApps = axios.create({
  baseURL: WINE_APPS_SRC_URL
});
