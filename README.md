# component-library

Accessible UI component library written in React and TypeScript.

---

![Lines](https://img.shields.io/badge/lines-100%25-brightgreen.svg?style=flat)
![Functions](https://img.shields.io/badge/functions-100%25-brightgreen.svg?style=flat)
![Branches](https://img.shields.io/badge/branches-100%25-brightgreen.svg?style=flat)
![Statements](https://img.shields.io/badge/statements-100%25-brightgreen.svg?style=flat)

---

## Stack

- **React 19** — UI components
- **TypeScript** — strict type checking
- **Vite** — library build (ESM + CJS output)
- **Vitest** — unit and component tests
- **ESLint** — linting with `typescript-eslint`, `eslint-plugin-jsx-a11y`, and `eslint-plugin-react-hooks`
- **Prettier** — code formatting

## Project structure

```
src/
  index.ts        # public entry point — re-exports all components
  components/     # one folder per component
dist/             # build output (not committed)
  index.js        # ESM bundle
  index.cjs       # CJS bundle
  index.d.ts      # TypeScript declarations
```

## Scripts

| Command         | Description                      |
| --------------- | -------------------------------- |
| `yarn build`    | Type-check and build the library |
| `yarn test`     | Run tests in watch mode          |
| `yarn test:run` | Run tests once                   |
| `yarn lint`     | Lint the source                  |

## Using in another project

Install the package, then import components directly:

```tsx
import { Button } from 'component-library';
```
