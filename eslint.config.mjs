import typescriptEslint from 'typescript-eslint';
import js from "@eslint/js";
import stylistic from '@stylistic/eslint-plugin';

export default typescriptEslint.config({
  files: ['**/*.ts'],
  ignores: ['.node_modules/*'],
  extends: [
    js.configs.recommended,
    ...typescriptEslint.configs.strictTypeChecked,
    ...typescriptEslint.configs.stylisticTypeChecked,
    stylistic.configs['disable-legacy'],
    stylistic.configs.customize({
      arrowParens: true,
      braceStyle: '1tbs',
      flat: true,
      jsx: false,
      quotes: 'single',
      quoteProps: 'as-needed',
      semi: true,
    }),
  ],
  languageOptions: {
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
  rules: {
    "@stylistic/lines-between-class-members": ["error", "always", {
      exceptAfterSingleLine: true,
    }],
    "@stylistic/max-len": ["warn", {
      code: 100,
      ignoreUrls: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreComments: true,
    }],
    "@stylistic/member-delimiter-style": ["error", {
      multiline: {
        delimiter: "semi",
        requireLast: true,
      },

      singleline: {
        delimiter: "semi",
        requireLast: false,
      },
    }],
    "@typescript-eslint/dot-notation": ["error", {
      allowIndexSignaturePropertyAccess: true,
    }],
    "@typescript-eslint/explicit-module-boundary-types": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-floating-promises": "warn",
    "@typescript-eslint/prefer-nullish-coalescing": [
      "error",
      {
        ignorePrimitives: {
          string: true,
          number: true,
        }
      }
    ],
    "@typescript-eslint/restrict-template-expressions": [
      "error",
      {
        allowNumber: true,
      }
    ],
    "@typescript-eslint/unbound-method": "off",
    "@typescript-eslint/use-unknown-in-catch-callback-variable": "off",
    "default-case": "warn",
    "linebreak-style": "off",
    "no-await-in-loop": "warn",
    "no-continue": "warn",
    "no-param-reassign": ["error", {
      props: false,
    }],
    "no-plusplus": "off",
    "no-underscore-dangle": ["error", {
      allowAfterThis: true,
    }],
    "no-var": "error",
    "object-curly-newline": ["error", {
      ObjectExpression: {
        minProperties: 4,
        multiline: true,
        consistent: true,
      },
      ObjectPattern: {
        minProperties: 4,
        multiline: true,
        consistent: true,
      },
      ImportDeclaration: {
        minProperties: 6,
        multiline: true,
        consistent: true,
      },
      ExportDeclaration: {
        minProperties: 6,
        multiline: true,
        consistent: true,
      },
    }],
    "prefer-destructuring": ["error", {
      object: true,
      array: false,
    }],
  },
});
