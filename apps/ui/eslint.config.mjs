import tseslint from '@electron-toolkit/eslint-config-ts';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import eslintPluginReactRefresh from 'eslint-plugin-react-refresh';

export default tseslint.config(
  { ignores: ['**/node_modules', '**/dist', '**/out'] },
  tseslint.configs.recommended,
  eslintPluginReact.configs.flat.recommended,
  eslintPluginReact.configs.flat['jsx-runtime'],
  {
    settings: {
      react: {
        version: 'detect'
      }
    }
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': eslintPluginReactHooks,
      'react-refresh': eslintPluginReactRefresh
    },
    rules: {
      ...eslintPluginReactHooks.configs.recommended.rules,
      ...eslintPluginReactRefresh.configs.vite.rules,
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      'prettier/prettier': 'off',
      'no-unsafe-finally': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'react/prop-types': 'off',
      'react-refresh/only-export-components': 'off',
      'react/display-name': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-async-promise-executor': 'off',
      'no-useless-catch': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'no-extra-boolean-cast': 'off',
      'react/jsx-key': 'off'
    }
  }
);
