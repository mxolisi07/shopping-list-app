# Step by Step Plan

## Phase 1: Setup
  Install React + TypeScript (npx create-react-app my-app --template typescript).
  Install Redux Toolkit (npm install @reduxjs/toolkit react-redux).
  Install React Router (npm install react-router-dom).
  Install json-server (npm install json-server).
  Create db.json with two collections: users and shoppingLists.

## Phase 2: Authentication
  Registration Page: Form with name, surname, email, password, cell number. Encrypt password before saving.
  Login Page: Form with email + password. Decrypt stored password and validate.
  Protected Routes: Use React Router + Redux state to restrict access.

## Phase 3: Profile Management
  Profile Page: Display user info.
  Allow update profile (name, surname, cell).
  Allow update credentials (email, password).

## Phase 4: Shopping List Management
  Add Shopping List: Form with name, quantity, notes, category, image upload.
  View Shopping Lists: Display all lists belonging to logged-in user.
  Update Shopping List: Edit existing list.
  Delete Shopping List: Remove list or specific items.

## Phase 5: Search + Sort
  Search: Input field → filters lists by name. Updates URL (?search=keyword).
  Sort: Dropdown → sorts lists by name, category, or date. Updates URL (?sort=criteria).

## Phase 6: Sharing
  Generate a shareable link for each shopping list.
  Allow users to copy or send the link via email.



## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
