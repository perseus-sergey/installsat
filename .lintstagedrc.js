const path = require('path');

// const buildPrettierCommand = (filenames) =>
//   `prettier --write --file ${filenames
//     .map((f) => path.relative(process.cwd(), f))
//     .join(' --file ')}`;

// const buildEslintCommand = (filenames) =>
//   `next lint --fix --file ${filenames
//     .map((f) => path.relative(process.cwd(), f))
//     .join(' --file ')}`;

// module.exports = {
//   '*.{js,jsx,ts,tsx}': [buildPrettierCommand, buildEslintCommand],
// };

// "precommit": "lint-staged",
//     "type-check": "tsc --project tsconfig.json --pretty --noEmit && echo ",
//     "prepare": "husky install"
//   },
//   "lint-staged": {
//     "*.{js,jsx,ts,tsx}": [
//       "prettier --write",
//       "yarn lint",
//       "yarn type-check"
//     ],
//     "./*.md": [
//       "prettier --write"
//     ]
//   },

module.exports = {
  '**/*.(ts|tsx)': () => 'yarn tsc --noEmit',

  '**/*.(ts|tsx|js|scss|css)': (filenames) => [`yarn prettier --write ${filenames.join(' ')}`],

  '**/*.(ts|tsx|js)': (filenames) =>
    `next lint --fix --file ${filenames
      .map((f) => path.relative(process.cwd(), f))
      .join(' --file ')}`,

  '**/*.(md|json)': (filenames) => `yarn prettier --write ${filenames.join(' ')}`,
};
