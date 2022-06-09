module.exports = {
  extends: ['universe', 'universe/shared/typescript-analysis'],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.d.ts'],
      parserOptions: {
        project: './tsconfig.json'
      }
    }
  ],
  rules: {
    'prettier/prettier': [
      'error',
      {
        printWidth: 100,
        singleQuote: true,
        parser: 'typescript',
        semi: true,
        endOfLine: 'auto',
        trailingComma: 'none'
      }
    ]
  }
};
