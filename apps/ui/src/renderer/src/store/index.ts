import { configureStore } from '@reduxjs/toolkit';
import { rootState } from '@states';

export const store = configureStore({ reducer: rootState });
