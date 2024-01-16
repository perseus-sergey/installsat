const path = require('path');

const buildPrettierCommand = (filenames) =>
  `prettier --write --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')}`;

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')}`;

module.exports = {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand],
};

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

// module.exports = {
//   // this will check Typescript files
//   '**/*.(ts|tsx)': () => 'yarn tsc --noEmit',

//   // This will lint and format TypeScript and                                             //JavaScript files
//   '**/*.(ts|tsx|js)': (filenames) => [
//     `yarn eslint --fix ${filenames.join(' ')}`,
//     `yarn prettier --write ${filenames.join(' ')}`,
//   ],

//   // this will Format MarkDown and JSON
//   '**/*.(md|json)': (filenames) =>
//     `yarn prettier --write ${filenames.join(' ')}`,
// }