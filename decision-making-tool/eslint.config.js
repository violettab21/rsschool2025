const globals = require('globals');
const pluginJs = require('@eslint/js');
const tseslint = require('typescript-eslint');
const prettier = require('prettier');

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
    { files: ['**/*.{js,mjs,cjs,ts}'] },
    {
        languageOptions: {
            globals: globals.browser,
            parser: '@typescript-eslint/parser',
            parserOptions: {
                projectService: true,
                tsconfigRootDir: __dirname,
            },
        },
    },
    {
        rules: {
            'no-debugger': 'off',
            'no-console': 0,
            'class-methods-use-this': 'off',
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/consistent-type-assertions': [
                'warn',
                { assertionStyle: 'never' },
            ],
            '@typescript-eslint/consistent-type-imports': 'error',
            '@typescript-eslint/explicit-function-return-type': 'error',
            '@typescript-eslint/explicit-member-accessibility': [
                'error',
                {
                    accessibility: 'explicit',
                    overrides: { constructors: 'off' },
                },
            ],
            '@typescript-eslint/member-ordering': 'error',
            'class-methods-use-this': 'error',
            '@typescript-eslint/consistent-type-definitions': [
                'error',
                'interface',
            ],
        },
    },
    {
        plugins: {
            prettier: prettier,
            tseslint: tseslint,
        },
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
];
